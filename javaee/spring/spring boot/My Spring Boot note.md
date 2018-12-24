# Spring Boot

## 运行流程

### 1.创建SpringApplication对象

```java
initialize(source）;
//主配置类，spring boot可以有好几个主配置类
private void initialize(Object[] sources) {
   if (sources != null && sources.length > 0) {
      this.sources.addAll(Arrays.asList(sources));
   }
  //判断当前运行环境是不是web
   this.webEnvironment = deduceWebEnvironment();
  //会先加载META-INF/spring.factories所有的类，
  //然后获取所有实现了ApplicationContextInitializer接口的初始化器集合
   setInitializers((Collection) getSpringFactoriesInstances(
         ApplicationContextInitializer.class));
  //获取所有实现了ApplicationListener接口的监听器集合
   setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
  //判断当前的类是否有main方法
   this.mainApplicationClass = deduceMainApplicationClass();
}
```

### 2.调用SpringApplication run方法

```java

public ConfigurableApplicationContext run(String... args) {
  //封装了一个对开始时间，结束时间记录操作的Java类，
		StopWatch stopWatch = new StopWatch();
  //记录开始时间
		stopWatch.start();
		ConfigurableApplicationContext context = null;
  //异常处理接口
		FailureAnalyzers analyzers = null;
  //这个函数主要是对System.property中"java.awt.headless“的配置，如果没有配置，默认为true
		configureHeadlessProperty();
  //从META-INF/spring.factories获取所有实现了ApplicationListener接口的监听器集合
		SpringApplicationRunListeners listeners = getRunListeners(args);
  //启动所有的监听器
		listeners.starting();
		try {
          //args是main中的string ....args
			ApplicationArguments applicationArguments = new DefaultApplicationArguments(
					args);
  //读取配置文件，系统变量来生成environment
			ConfigurableEnvironment environment = prepareEnvironment(listeners,
					applicationArguments);
 // 获取Banner实例，banner为启动的时候绘制的图案。在生成Banner实例的时候，对resourceLoader进行了初始化
			Banner printedBanner = printBanner(environment);
 //根据是否是web环境来创建spring的ioc容器
			context = createApplicationContext();
 //创建实例用来处理异常
			analyzers = new FailureAnalyzers(context);
 //准备上下文环境;将environment保存到ioc中；而且applyInitializers()；
 //applyInitializers()：回调之前保存的所有的ApplicationContextInitializer的initialize方法
 //回调所有的SpringApplicationRunListener的contextPrepared()；
			prepareContext(context, environment, listeners, applicationArguments,
					printedBanner);
  // 完成对ctx的配置和管理，包括注册bean, bean处理器, beanFactory, listeners等，如果是web环境还会启动tomcat
  // 在refresh函数执行之后，所有的bean都已经被ctx管理（下文有具体配置）
			refreshContext(context);
  //从ioc容器中获取所有的ApplicationRunner和CommandLineRunner进行回调
  //ApplicationRunner先回调，CommandLineRunner再回调
			afterRefresh(context, applicationArguments);
  //所有的SpringApplicationRunListener回调finished方法       
			listeners.finished(context, null);
  //记录结束时间
			stopWatch.stop();
			if (this.logStartupInfo) {
				new StartupInfoLogger(this.mainApplicationClass)
						.logStarted(getApplicationLog(), stopWatch);
			}
			return context;
		}
		catch (Throwable ex) {
			handleRunFailure(context, listeners, analyzers, ex);
			throw new IllegalStateException(ex);
		}
	}
```



## refreshContext

### 作用：

 完成对ctx的配置和管理，包括注册bean, bean处理器, beanFactory, listeners等，如果是web环境还会启动tomcat

### 流程

```java
    // 刷新容器前的准备；
		//验证必须的属性有没有配置
	prepareRefresh();

    prepareRefresh();
    // 通过模板模式，在obtain的时候，调用了子类的refreshBeanFactory方法，然后获取到beanFactory，这里的beanFactory中只有预准备的一些比较关键的bean
    ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
    // 预准备配置beanFactory，比如配置了classLoader、提供Aware功能的BeanPostProcessor、根据bean类型判断是不是ApplicationListener来决定是否注册listener的BeanPostProcessor、还有注册了如environment, systemProperties等重要的bean
    prepareBeanFactory(beanFactory);
    try {
      // 模板模式，提供给子代调用的回调函数（重要）
      // 在AbstractApplicationContext中，没有做什么实质性的逻辑，但是在子代中（web环境下使用的是AnnotationConfigEmbeddedWebApplicationContext，其重写了postProcessBeanFactory函数，扫描package，解析annotation，生成BeanDefination的重要工作，都是在这里面完成的）
      postProcessBeanFactory(beanFactory);
      // 到此，所有的bean都已经成功的加载，这里执行了Bean中定义的BeanFactoryPostProcessor。因为这里BeanFactory已经加载成功了，所以不需要像原来一样通过配置文件和系统变量来加载，这里可以直接获取到所有bean的信息
      invokeBeanFactoryPostProcessors(beanFactory);
      // 获取到bean中定义的所有的BeanPostProcessor，并注册到beanFactory
      registerBeanPostProcessors(beanFactory);
      // 初始化bean中定义的所有的MessageSource，如果找不到，则使用默认
      initMessageSource();
      // 初始化ApplicationEventMulticaster，仅仅是初始化，具体添加listener在registerListeners中完成
      initApplicationEventMulticaster();
      // 这也是模板模式的一个体现，onRefresh留给自带去执行自己的逻辑，AbstractApplicationContext并没有执行逻辑
      // 这里也是比较重要的一个回调函数，其中（TODO: 稍后补充）在这里执行
	//是一个空函数，由子类实现（主要是EmbeddedWebApplicationContext），大致上会创建servlet容器
      onRefresh();
      // 获取到bean中定义的所有的listener，并注册到multicaster上，同时之前earlyApplicationEvent中的event会被publish
      registerListeners();
      // 到这里，基本上beanFactory已经很成熟了，这里进行一些收尾的设置，然后，对所有还没有实例化的no-lazy-init singletons进行实例化。其中，对于在这里进行实例化的bean, BeanPostProcessor在这里触发
      finishBeanFactoryInitialization(beanFactory);
      // 到此，refresh已经结束，这里主要是触发一些回调函数以及发布ContextRefreshedEvent
      finishRefresh();
    }

      catch (BeansException ex) {
      if (logger.isWarnEnabled()) {
      logger.warn("Exception encountered during context initialization - " +
      "cancelling refresh attempt: " + ex);
      }

      // Destroy already created singletons to avoid dangling resources.
      destroyBeans();

      // Reset 'active' flag.
      cancelRefresh(ex);

      // Propagate exception to caller.
      throw ex;
      }

      finally {
      // Reset common introspection caches in Spring's core, since we
      // might not ever need metadata for singleton beans anymore...
      resetCommonCaches();
      }
```

##     onRefresh()

### 作用

启动servlet容器（tomcat、jetty等）

```java
//创建自动配置servlet容器
private void createEmbeddedServletContainer() {
    EmbeddedServletContainer localContainer = this.embeddedServletContainer;
//根据配置获取当前的servlet容器
    ServletContext localServletContext = getServletContext();
//  如果localContainer和localServletContext 均为空的话，肯定是第一次启动的，就进行相关的配置工作
    if (localContainer == null && localServletContext == null) {
// 获取到ServletContainer的对象生成工厂
     EmbeddedServletContainerFactory containerFactory=getEmbeddedServletContainerFactory(); 
// 生成对应的ServletContainer，并且通过getSelfInitializer()获取到相应的初始化bean
      this.embeddedServletContainer = containerFactory
        .getEmbeddedServletContainer(getSelfInitializer());
    }
    else if (localServletContext != null) {//如果不为空
      try {
        getSelfInitializer().onStartup(localServletContext);
      }
      catch (ServletException ex) {
        throw new ApplicationContextException("Cannot initialize servlet context",ex);
      }
    }
    initPropertySources();
	}
```





## 整合

### 缓存

![搜狗截图20180522090642](D:\java lib\study_spring\springboot\images\搜狗截图20180522090642.png)

​	缓存组件在进行初始化时，**CacheConfigurationImportSelector**会根据配置条件加载缓存配置，

​	在不指定条件时默认**GenericCacheConfiguration**、**SimpleCacheConfiguration**

#### @cacheable

加入缓存

![搜狗截图20180522085559](D:\java lib\study_spring\springboot\images\搜狗截图20180522085559.png)



```java
/**
     *  value                    缓存组件名
     *  cacheNames               和value相同
     *  key                      缓存的关键key默认是参数名
     *  keyGenerator             自定义的key
     *  cacheManager             缓存管理器
     *  cacheResolver            缓存解析
     *  condition                存放缓存的条件当为true时放入缓存
     *  unless                   判断条件为true时不放入缓存
     *  sync                     是否同步
     */
    @Cacheable(value = "emp",keyGenerator = "myKeyGenerator")
    public Employee selectEmployee(Integer employeeId){
        return employeeMapper.selectEmployee(employeeId);
    }
```

#### @CachePut

缓存更新

​	和cacheable相同的参数

​	相比于cacheable，key参数多了#result

```java
@CachePut(value = "emp",keyGenerator = "myKeyGenerator")
public int updateEmployee(Employee employee){
    return employeeMapper.updateEmployee(employee);
}
```

#### @CacheEvict

删除缓存

​	boolean allEntries() default false;所有缓存的删除

​	boolean beforeInvocation() default false;缓存的清除是否在方法执行之前

```java
 @CacheEvict(value = "emp",keyGenerator = "myKeyGenerator")
    public int deleteEmployee(Integer employeeId){
        return employeeMapper.deleteEmployee(employeeId);
    }
```

#### @caching

​	可以进行复杂条件配置缓存

#### @CacheConfig

​	对缓存公共的部分进行抽取

## 端口监听

[Spring Boot-Actuator](https://docs.spring.io/spring-boot/docs/2.0.6.RELEASE/reference/htmlsingle/#production-ready) 就是帮助我们监控我们的Spring Boot 项目的。

添加依赖

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-actuator</artifactId>
	</dependency>
</dependencies>
```

官方开放的监听端口：

| 端口ID        |                                作用 |
| :---------- | --------------------------------: |
| auditevents |                   公开当前应用程序的审核事件信息 |
| autoconfig  | 显示自动配置报告，显示所有自动配置候选项以及它们“未被”应用的原因 |
| beans       |         显示应用程序中所有Spring bean的完整列表 |
| configprops |                         显示所有配置信息。 |
| dump        |                             打印线程栈 |
| env         |                          查看全部环境变量 |
| health      |                      显示应用程序运行状况信息 |
| info        |                            显示应用信息 |
| loggers     |                  显示和修改应用程序中记录器的配置 |
| liquibase   |            显示已应用的任何Liquibase数据库迁移 |
| metrics     |                   显示当前应用程序的“指标”信息 |
| mappings    |        显示所有@RequestMapping路径的整理列表 |
| shutdown    |              允许应用程序正常关闭（默认情况下不启用） |
| trace       |        显示跟踪信息（默认情况下是最近的100个HTTP请求 |

查看方式：

​	HTTP：{项目访问的url前缀}/actuator/{上述的端口ID}

​			这种方式默认情况下上述端口只有health、info是可以直接访问的，需要在配置文件中添加如下

​			`management.endpoints.web.exposure.include=*`

​	JMX : windows CMD方式下输入 jconsole，弹出窗口选择程序进程，点击在MBean标签的org.springframework.boot域下可对我们的程序进行监控和管理



配置端口：

```properties
#打开指定端口：
management.endpoints.enabled-by-default=false
management.endpoint.<id>.enabled = true
management.endpoints.jmx.exposure.include=.....（JMX方式查看）
#打开全部（https）
management.endpoints.web.exposure.include=*
#打开除了xxxx端口之外所有端口
management.endpoints.jmx.exposure.exclude=......(JMX方式查看)
management.endpoints.web.exposure.exclude=......(http方式查看)
#设置缓存时间(指定时间内连续访问会将结果缓存)
management.endpoint.<id>.cache.time-to-live=10s

```

实现自定的端口（没测试）

​	1.@JmxEndpoint、@WebEndpoint

​	2.实现HealthIndicator 接口