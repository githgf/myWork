# spring

## 定义:

?	轻量级控制反转（IOC）和面向切面编程（AOP）的容器框架

## 组成

?	![spring](D:\java lib\study_spring\springimage\spring.PNG)



## IOC

定义：**控制反转**，就是把原先我们代码里面需要实现的对象创建、依赖的代码，反转给容器来帮忙实现。那		    么必然的我们需要创建一个容器，同时需要一种描述来让容器知道需要创建的对象与对象的关系。这个描述最具体表现就是我们可配置的文件。

### 结构体系

spring ioc 提供了两种ioc容器的实现：BeanFactory  ApplicationContext

![srping_beanfactory](D:\java lib\study_spring\springimage\srping_beanfactory.PNG)

#### BeanFactory

?	是ioc容器的基本实现，是顶层的父类接口，其有三个实现子类

?	ListableBeanFactory： 列表类的bean

?	HierarchicalBeanFactory ：有父类继承原则

?	AutowireCapableBeanFactor：自动装配原则

?	



bean 定义：

?	![spring_bean](D:\java lib\study_spring\springimage\spring_bean.PNG)

?	Bean 的定义就是完整的描述了在 Spring 的配置文件中你定义的 <bean/> 节点中所有的信息，包括各种子节点。当 Spring 成功解析你定义的一个 <bean/> 节点后，在 Spring 的内部就被转化成 BeanDefinition 对象。以后所有的操作都是对这个对象完成的。



bean 解析类

?	![spring_beanSolver](D:\java lib\study_spring\springimage\spring_beanSolver.PNG)



#### ApplicationContext

?	是BeanFactory实现子类**最常用**，其有两个实现类

?			–ClassPathXmlApplicationContext：从类路径下加载配置文件

?			–FileSystemXmlApplicationContext:从文件系统中加载配置文件

?	扩展：

?		ConfigurableApplicationContext：新增close()和refresh() 方法让applicationContext能刷新

?		WebApplicationContext：是专门为WEB应用而准备的，它允许从相对于WEB根目录的路径中完成			   初始化工作

### 	自动装配

#### 原理

?	注入分类：通过属性、通过构造器注入

?	属性注入：

?		1.**byName**: 从Spring环境中获取目标对象时，目标对象中的属性会根据名称在整个Spring环境中查找<bean>标签的id属性值。如果有相同的，那么获取这个对象，实现关联。整个Spring环境：表示所有的spring配置文件中查找，那么id不能有重复的。 

?		2.**byType** ->从Spring环境中获取目标对象时，目标对象中的属性会根据类型在整个spring环境中查找<bean>标签的class属性值。如果有相同的，那么获取这个对象，实现关联

?	构造器注入：

?		相当于通过byType方式

#### 注解装配

?	@Inject：和@Resource配合使用

?	@Resource：和@Quality配合根据bean的id名查找

?	@AutoWired:默认根据类型去找



## AOP

定义：面向切面编程

?	底层是动态代理

?AspectJ 支持5种类型的通知注解:

?	–@Before: 前置通知,在方法执行之前执行

?	–@After: 后置通知,在方法执行之后执行

?	–@AfterRunning: 返回通知,在方法返回结果之后执行

?	–@AfterThrowing: 异常通知,在方法抛出异常之后

?	–@Around: 环绕通知,围绕着方法执行



切面的优先级：@Order



bean之间的关系

	继承：通过在bean实例化配置时指定父类parent：... 实现继承，
			<bean class="entity.Role" id="role">
				<constructor-arg value="1" type="java.lang.Integer" name="roleId"/>
			</bean>
	
			<bean id="subRole" parent="role"/>
	
			如果一个bean没有继承任何父类，没有指定class，那么这个bean必须是抽象的bean，
			只要将abstract属性设置为true就行
			<bean id="subRole" parent="role" abstract="true" />
			
	依赖：允许在bean中设置depend-on属性来实现依赖，依赖的bean将会在被依赖bean创建前被创建
			<bean class="entity.Employee" id="employee3" depends-on="role">
				<property name="empName" value="jack"/>
			</bean>
# 		Spring注解驱动

## 组件 

### spring 注册组件的两种方式：

- 一：ComponentScan   + Configuration  注解

1.@ComponentScan   指定扫描包

2.@Bean  指定初始化销毁、初始化其他方式、BeanPostProcessor

3.@Configuration 相当于配置文件（一个类是一个配置文件）

- [ ] ```java
      @Configuration
      @ComponentScan("SpringAnnotationDriver")
      public class MyBatisConfig {

          @Bean(value = "dbcpDataSource")
          public BasicDataSource dataSource(){

              BasicDataSource basicDataSource = new BasicDataSource();

                  basicDataSource.setUrl("jdbc:mysql://localhost:3306/test?useUnicode=true&amp;characterEncoding=utf-8");
                  basicDataSource.setUsername("root");
                  basicDataSource.setPassword("0626");
                  basicDataSource.setDriverClassName("com.mysql.jdbc.Driver");
                      return basicDataSource;
            }
      ```


自定义扫描策略

- [ ] ```java
      @Configuration  //告诉Spring这是一个配置类

      @ComponentScans(
      		value = {
      				@ComponentScan(value="com.atguigu",includeFilters = {
      /*						@Filter(type=FilterType.ANNOTATION,classes={Controller.class}),
      						@Filter(type=FilterType.ASSIGNABLE_TYPE,classes={BookService.class}),*/
      						@Filter(type=FilterType.CUSTOM,classes={MyTypeFilter.class})
      				},useDefaultFilters = false)	
      		}
      		)
      //@ComponentScan  value:指定要扫描的包
      //excludeFilters = Filter[] ：指定扫描的时候按照什么规则排除那些组件
      //includeFilters = Filter[] ：指定扫描的时候只需要包含哪些组件
      //FilterType.ANNOTATION：按照注解
      //FilterType.ASSIGNABLE_TYPE：按照给定的类型；
      //FilterType.ASPECTJ：使用ASPECTJ表达式
      //FilterType.REGEX：使用正则指定
      //FilterType.CUSTOM：使用自定义规则
      public class MainConfig {
      	
      	//给容器中注册一个Bean;类型为返回值的类型，id默认是用方法名作为id
      	@Bean("person")
      	public Person person01(){
      		return new Person("lisi", 20);
      	}

      }
      ```

- 二、@Import注解

  ?	用法：

  ?		@Import({Role.class....})、

  ?		直接实现ImportSelector接口将注册类的全类名放在其中返回

+ 三、@Bean

  适用于导入外部的组件

- 四、自定义factoryBean

  - [ ] ```java
        package SpringAnnotationDriver.config;

        import org.springframework.beans.factory.FactoryBean;

        /**
         * @Author: FanYing
         * @Date: 2018-04-29 21:12
         * @Desciption:
         */
        public class  MyFactoryBean<T> implements FactoryBean<T>
        {
            private Class<T> t;
            public MyFactoryBean(Class<T> t) {

                this.t = t;
            }

            @Override
            public T getObject() throws Exception {
                return t.newInstance();
            }

            @Override
            public Class<?> getObjectType() {
                return t.getClass();
            }

        	//是否是单例
            @Override
            public boolean isSingleton() {
                return false;
            }
        }

        //注册时：
         @Bean("employee")
            public MyFactoryBean myFactoryBean(){
                return new MyFactoryBean(Employee.class);
            }
         @Bean("role")
            public MyFactoryBean myFactoryBean(){
                return new MyFactoryBean(Role.class);
            }

        ```

  - 五、@Conditional

    根据条件动态的获取注册组件

    ?

  - [ ] ```java
        @Conditional(LinuxCondition.class)
            @Bean("linuxJdbc")
            public JdbcConfig linuxJdbcConfig(){
                return new JdbcConfig();
            }
        
            @Conditional(WindowCondition.class)
            @Bean("winJdbc")
            public JdbcConfig WindowJdbcConfig(){
        
                return new JdbcConfig();
            }



        -----------------------------------------------------------------------------
          package SpringAnnotationDriver.config;
    
        import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
        import org.springframework.beans.factory.support.BeanDefinitionRegistry;
        import org.springframework.context.annotation.Condition;
        import org.springframework.context.annotation.ConditionContext;
        import org.springframework.core.env.Environment;
        import org.springframework.core.type.AnnotatedTypeMetadata;
    
        /**
         * @Author: FanYing
         * @Date: 2018-04-30 7:55
         * @Desciption: 判断当前的运行环境是不是windows系统
         */
    
        public class LinuxCondition implements Condition{
            @Override
            public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    
                //获取到IOC使用的beanFactory
                ConfigurableListableBeanFactory configurableListableBeanFactory =
                        context.getBeanFactory();
                //获取当前的类加载器
                ClassLoader classLoader = context.getClassLoader();
                //当前的环境变量
                Environment environment = context.getEnvironment();
                //注册组件
                BeanDefinitionRegistry beanDefinitionRegistry = context.getRegistry();
    
                String osName = environment.getProperty("os.name");
    
                if(osName.contains("linux")){
    
                    return true;
                }
    
                return false;
            }
        }
    
        ```

  ## 组件的生命周期

  ?

初始化：

?	单实例：执行构造器

?	多实例：不执行

创建

?	单实例：执行

?	多实例：执行

销毁

?	单实例：被ioc容器管理由ioc容器决定销毁的时间

?	多实例：不被ioc容器控制

- @Bean

  ?	在bean中自定义init和destroy方法

  - [ ] ```java

         public void init(){

         	    System.out.println("employee is init..............");

            }
         ```


            public void destroy(){

        	    System.out.println("employee is destroy..............");
            }
            ----------------------------------------------------------------------------------
              @Bean(initMethod = "init",destroyMethod = "destroy")
            public Employee employee(){
                return new Employee();
            }
        ```

  ?


- 实现DisposableBean，InitializingBean接口（销毁、创建）

- - [ ] ```java
        @PreDestroy
            public void destroy(){

        	    System.out.println("employee is destroy..............");
            }
        ```


        	public Employee() {
                super();
                // TODO Auto-generated constructor stub
            }
        ```

  ## 属性赋值

  ?


- @Value注解

  ## 自动装配

  ```java
  @Autowired
  @Inject
  @Resource
  ```
  ## AOP



- 步骤：

  ?	1.定义要被切面增强的类

  ?	

  ```java
  public class TestEntity {

      public TestEntity() {
      }

      public int test(int i, int y){

          return i/y;
      }
  ```


  }	
  ```

  ?	2.定义切面类

  ?	3.被切面增强类织入切面类中

  ?		

  - [ ] ```java
        /*
        *	参数中的joinPoint必须放在第一个
        *
        */
        @Aspect
        public class PointEntity {

            @Pointcut("execution(* SpringAnnotationDriver.aop.TestEntity.test(..))")
            public void pointMethod(){}

            @Before(value = "pointMethod()")
            public void logStart(JoinPoint joinPoint){
                System.out.println("Before运行的方法是...."+joinPoint.getSignature().getName()+
                        "运行参数.."+ Arrays.asList(joinPoint.getArgs())
                );
        }

            @After("pointMethod()")
            public void logEnd(JoinPoint joinPoint){

                System.out.println("after "+joinPoint.getSignature().getName()+"运行结束");

            }

            @AfterReturning(value = "pointMethod()",returning = "result")
            public void logReturn(JoinPoint joinPoint,Object result){

                System.out.println("AfterReturning  "+joinPoint.getSignature().getName()+
                        "方法运行结束结果是....."+result);

            }

            @AfterThrowing(value = "pointMethod()",throwing = "ex")
            public void logThrow(JoinPoint joinPoint,Exception ex){

                System.out.println("AfterThrowing "+joinPoint.getSignature().getName()+
                        "方法运行时异常.."+ex
                );

            }


        }
  ```

  ?	

  ?	4.将切面类和被切面增强类注册在ioc容器中

  ?	

```java
  @Bean
    public TestEntity testEntity(){
        return new TestEntity();
    }

    @Bean
    public PointEntity pointEntity(){
        return new PointEntity();
    }
```







## 事务

1.在需要进行事物的dao层的方法上加上@Transactional

2.在配置类上家注解@EnableTransactionManagement

3.在ioc容器中注册

```java
 @Bean
    public PlatformTransactionManager platformTransactionManager(){
        return new DataSourceTransactionManager(DataSource);
    }
```

原理

- [ ] ```java
      原理：
       * 1）、@EnableTransactionManagement
       * 			利用TransactionManagementConfigurationSelector给容器中会导入组件
       * 			导入两个组件
       * 			AutoProxyRegistrar
       * 			ProxyTransactionManagementConfiguration
       * 2）、AutoProxyRegistrar：
       * 			给容器中注册一个 InfrastructureAdvisorAutoProxyCreator 组件；
       * 			InfrastructureAdvisorAutoProxyCreator：？
       * 			利用后置处理器机制在对象创建以后，包装对象，返回一个代理对象（增强器），代理对象执行方法利用拦截器链进行调用；
       * 
       * 3）、ProxyTransactionManagementConfiguration 做了什么？
       * 			1、给容器中注册事务增强器；
       * 				1）、事务增强器要用事务注解的信息，AnnotationTransactionAttributeSource解析事务注解
       * 				2）、事务拦截器：
       * 					TransactionInterceptor；保存了事务属性信息，事务管理器；
       * 					他是一个 MethodInterceptor；
       * 					在目标方法执行的时候；
       * 						执行拦截器链；
       * 						事务拦截器：
       * 							1）、先获取事务相关的属性
       * 							2）、再获取PlatformTransactionManager，如果事先没有添加指定任何transactionmanger
       * 								最终会从容器中按照类型获取一个PlatformTransactionManager；
       * 							3）、执行目标方法
       * 								如果异常，获取到事务管理器，利用事务管理回滚操作；
       * 								如果正常，利用事务管理器，提交事务
      ```


