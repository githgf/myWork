# Spring MVC



## 使用 @RequestMapping 映射请求

1.@RequestMapping 能让前端发送的url请求映射到@controller标记的控制层的方法中

​	相当于在xml中配置处理器映射器HandlerMappering

2.注解使用范围：

​	1.类上：相当于基目录

​	2.方法上，精确匹配

3.参数：

​	value	url地址

​	method 	请求的方式：delete、post、get、put等

​	params 和 headers支持简单的表达式 

​		– param1: 表示请求必须包含名为 param1 的请求参数
​		– !param1: 表示请求不能包含名为 param1 的请求参数
​		– param1 != value1: 表示请求包含名为 param1 的请求参数，但其值
​				不能为 value1
​		– {“param1=value1”, “param2”}: 请求必须包含名为 param1 和param2
​				的两个请求参数，且 param1 参数的值必须为 value1 



## 映射请求参数 & 请求头

1.支持ant风格

​	

- [ ] ```java
   @RequestMapping(value = "/deleteUser/{userId}",method = RequestMethod.DELETE)
      public String deleteUser(@PathVariable String userId){
          System.out.println("删除"+userId);
          return "list";
      }
   ```
      ```
   
      ```



2.支持rest

​	

```java
@RequestMapping(value = "/saveAdd",method = RequestMethod.POST)
    public String testSave(User user){
        System.out.println("user is"+user);

        return "list";
    }

    @RequestMapping(value = "/deleteUser/{userId}",method = RequestMethod.DELETE)
    public String deleteUser(@PathVariable String userId){
        System.out.println("删除"+userId);
        return "list";
    }

    @RequestMapping(value = "/update",method = RequestMethod.PUT)
    public String updateUser(User user){

        System.out.println("修改...."+user);

        return "TestReset";
    }
```

相应的在前端提交数据时需要带上“_method”参数名，参数值为请求的类型"DELETE"、"PUT"

3.@RequestHeader注解能获取到请求头，在参数上

4.@CookieValue能获取到cookie的



## 处理模型数据

1.方法参数：

​	pojo实体类：spring mvc会自动将属性值赋值在实体类中

​	map：map中的值会存在request作用域中

​	servlet原生的类：HttpServletRequest、HttpRequest、HttpServletResponse、HttpSession

​	ModelAndView:则其既包含视图信息，也包含模型数据信息 ,默认转发

2.其余注解：

​	– @SessionAttributes: 将模型中的某个属性暂存到HttpSession 中，以便多个请求之间可以共享这个属性，							只能作用在类上

​	可能引发异常：Session attribute 'user' required - not found in session 

​	原因：被SessionAttributes标记的类中的方法在入参前会在session中找相关的属性值，如果找不到会报异

​	解决方案：和@ModelAttribute搭配使用

​		

- [ ] ```java
      @SessionAttributes(value = "user")
      public class UserController 
      {
          private User user;

          private Hobby hobby;

          @ModelAttribute
          public void getUser(Map<String,Object> userMap){
              userMap.put("hobby",new Hobby());
              userMap.put("user",new User());

          }
      }
      ```

      ​– @ModelAttribute: 方法入参标注该注解后, 入参的对象会放到数据模型中 ，方法中、参数中

      ​	在方法定义上使用 @ModelAttribute 注解：Spring MVC在调用目标处理方法前，会先逐个调用在方法级上标注了@ModelAttribute 的方法。
      • 	在方法的入参前使用 @ModelAttribute 注解：
      ​	– 可以从隐含对象中获取隐含的模型数据中获取对象，再将请求参数绑定到对象中，再传入入参
      ​	– 将方法入参对象添加到模型中 

视图和视图解析器
RESTful CRUD

## Spring MVC 表单标签 &处理静态资源

###  表单标签

1.通过 Spring MVC 的表单标签可以实现将模型数据中的属性和 HTML 表单元素相绑定，以实现表单数据更                便捷编辑和表单值的回显 

- [ ] ```jsp
      <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
          <form action="" method="POST">
              <input type="hidden" name="_method" value="DELETE" />
          </form>

          <a href="user/deleteUser/1">删除测试</a>

          <c:out value="<%=basePage%>" />
          <form:form action="user/saveAdd" method="post" modelAttribute="user">
              <%--path对应实体类中的实行名--%>

              邮箱：<form:input path="email" />
              姓名：<form:input path="userName" />
              <%--表单级联--%>
              <form:input path="hobby.hobbyName" />
              <%--爱好：<form:select path="hobby" items="${hobby}"--%>
                              <%--itemLabel="hobbyName" itemValue="hobbyEntity" />--%>
              <%--性别：<form:radiobuttons path="sex" items="${requestScope.sexMap}" />--%>

              <input type="submit" value="提交" />
          </form:form>
      ```

### 处理静态资源：

​	web.xml中设置了前端页面处理器会处理所有的请求包括静态资源，不作处理会报异常：找不到映射的url地址

​	解决方案：

​	1.<mvc:default-servlethandler/> 的方式解决静态资源的问题：
​		– <mvc:default-servlet-handler/> 将在 Spring MVC 上下文中定义一个DefaultServletHttpRequestHandler，						   它会对进入 DispatcherServlet 的请求进行筛查，如果发现是没有经过映射的请求，就将该请求交由 WEB应用				服务器默认的 Servlet 处理，如果不是静态资源的请求，才由DispatcherServlet 继续处理 

​	2.放弃所有静态资源拦截：<mvc:resources mapping="/static/**" location="/static/"/>



## 数据转换 & 数据格式化 & 数据校验

### 数据转换：

1.数据绑定流程

​	Spring MVC 主框架将 ServletRequest 对象及目标方法的入参实例传递给 WebDataBinderFactory 实例，以	创建 DataBinder 实例对象

​	DataBinder 调用装配在 Spring MVC 上下文中的ConversionService 组件进行数据类型转换、数据格式化工作。将 Servlet 中的请求信息填充到入参对象中

​	 调用 Validator 组件对已经绑定了请求消息的入参对象进行数据合法性校验，并最终生成数据绑定结果
BindingData 对象Spring MVC 抽取 BindingResult 中的入参对象和校验错误对象，将它们赋给处理方法的响应入参 

2.<mvc:annotation-driven /> 会自动注册

​	RequestMappingHandlerMapping

​	RequestMappingHandlerAdapter 

​	ExceptionHandlerExceptionResolver 



### 数据格式化

​	Spring 在格式化模块中定义了一个实现ConversionService 接口的FormattingConversionService 实现类，该实现类扩展了 GenericConversionService，因此它既具有类型转换的功能，又具有格式化的功能
​	 FormattingConversionService 拥有一个FormattingConversionServiceFactroyBean 工厂类，后者用于在 Spring 上下文中构造前者 

​	--@DateTimeFormat 

​	--@NumberFormat 

### 数据校验

JSR 303 是 Java 为 Bean 数据合法性校验提供的标准框架，它已经包含在 JavaEE 6.0 中 .
• JSR 303 通过在 Bean 属性上标注类似于 @NotNull、@Max等标准的注解指定校验规则，并通过标准的验证接口对 Bean进行验证 

​	![D:\\java lib\\study_spring\\jr303.PNG](D:\java lib\study_spring\jr303.PNG)

2.如何使用：

​	1.添加依赖

​	

- [ ] ```xml
      <dependency>  
          <groupId>javax.validation</groupId>  
          <artifactId>validation-api</artifactId>  
          <version>1.1.0.Final</version>  
      </dependency>  
      <dependency>  
          <groupId>org.apache.bval</groupId>  
          <artifactId>bval-jsr303</artifactId>  
          <version>0.5</version>  
      </dependency> 
      ```

      ​需要在入参的参数前打上@Valid注解

      ​显示错误信息

```java

    @RequestMapping(value = "/update",method = RequestMethod.PUT)
    public String updateUser(@Valid User user, BindingResult result,Error error){

        System.out.println("修改...."+user);

        return "TestReset";
    }
```

​		在 JSP 页面上可通过 <form:errors path=“userName”>显示错误消息 



### 处理 JSON：使用 HttpMessageConverter

```java
	使用 HttpMessageConverter<T> 将请求信息转化并绑定到处理方法的入参中或将响应结果转为对应类型的响应信息，Spring 提供了两种途径：
	– 使用 @RequestBody / @ResponseBody 对处理方法进行标注
	– 使用 HttpEntity<T> / ResponseEntity<T> 作为处理方法的入参或返回值
	当控制器处理方法使用到 @RequestBody/@ResponseBody 或HttpEntity<T>/ResponseEntity<T> 时, 	Spring 首先根据请求头或响应头的Accept 属性选择匹配的 HttpMessageConverter, 进而根据参数类型或泛		型类型的过滤得到匹配的 HttpMessageConverter, 若找不到可用的
HttpMessageConverter 将报错
• @RequestBody 和 @ResponseBody 不需要成对出现
```

![httpContextMess](D:\java lib\study_spring\httpContextMess.PNG)





 11.国际化

## 文件的上传

​	Spring MVC 为文件上传提供了直接的支持，这种支持是通过即插即用的 MultipartResolver 实现的。Spring 用Jakarta Commons FileUpload 技术实现了一个MultipartResolver 实现类：CommonsMultipartResovler
​	Spring MVC 上下文中默认没有装配 MultipartResovler，因此默认情况下不能处理文件的上传工作，如果想使用 Spring的文件上传功能，需现在上下文中配置 MultipartResolver 

- [ ] ```java
      @RequestMapping("/upload")
          public String upload(@RequestParam("desc") String desc,
                               @RequestParam("file")MultipartFile file){
              System.out.println("fileDesc>>>"+desc);

              try {
                  file.transferTo(new File("D:\\"+file.getOriginalFilename()));
              } catch (IOException e) {
                  e.printStackTrace();
              }

              return "FileUpload";
          }
      ```


- [ ] ```xml
      <bean class="org.springframework.web.multipart.commons.CommonsMultipartResolver" id="multipartResolver">
              <property name="defaultEncoding" value="UTF-8" />
              <property name="maxUploadSize" value="20000" />
          </bean>
      ```



## 使用拦截器 

Spring MVC也可以使用拦截器对请求进行拦截处理，用户可以自定义拦截器来实现特定的功能，自定义的拦截器必须实现HandlerInterceptor接口
​	– preHandle()：这个方法在业务处理器处理请求之前被调用，在该方法中对用户请求 request 进行处理。如果程序员决定该拦截器对请求进行拦截处理后还要调用其他的拦截器，或者是业务处理器去进行处理，则返回true；如果程序员决定不需要再调用其他的组件去处理请求，则返回false。
​	– postHandle()：这个方法在业务处理器处理完请求后，但是DispatcherServlet 向客户端返回响应前被调用，在该方法中对用户请求request进行处理。
​	– afterCompletion()：这个方法在 DispatcherServlet 完全处理完请求后被调用，可以在该方法中进行一些资源清理的操作。 

## 	异常处理

​	

Spring MVC 通过 HandlerExceptionResolver 处理程序的异常，包括 Handler 映射、数据绑定以及目标方法执行时发生的异常 

​	@ExceptionHandler :使用了这个注解的方法如果检测到当前的handler类发生异常时会根据自定义的异常信息跳转到指定页面；

​	如果这个注解的类上有@ControllerAdvice那么则是全局异常

```java
@ControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(value = {RuntimeException.class,ArithmeticException.class})
    public ModelAndView exceptionHandler(Exception e){

            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("error");
            modelAndView.addObject("errorMess",e);

            return modelAndView;
    }

}
```



SimpleMappingExceptionResolver
如果希望对所有异常进行统一处理，可以使用SimpleMappingExceptionResolver，它将异常类名映射为
视图名，即发生异常时使用对应的视图报告异常 

```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
      <property name="exceptionMappings">
          <props>
              <prop key="java.lang.RuntimeException">error</prop>
          </props>
      </property>
  </bean>
```



## spring mvc  整合spring



​	spring mvc ioc 容器相当于spring ioc容器的子容器，也就是controller层是mvc，service以及dao层都是spring ioc容器的管理范围

​	**在spring mvc容器中创建的bean可以引用spring ioc创建的bean但是，spring ioc创建的bean不能引用spring mvc创建的bean**

​	举个例子：控制层可以注入service和dao层的实体类，但是service和dao层不能注入controller实体类

整合配置文件

​	

- [ ] ```java
      <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.springframework.org/schema/beans
             http://www.springframework.org/schema/beans/spring-beans.xsd">

          <bean id="propertiesConfig" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
              <property name="ignoreResourceNotFound" value="true" />
              <property name="locations">
                  <list>
                      <value>classpath:redis.properties</value>
                      <value>classpath:jdbc.properties</value>
                  </list>
              </property>
          </bean>

          <!--<import resource="classpath:shiro-spirng.xml"/>-->
          <import resource="classpath:spring-redis.xml" />
          <import resource="classpath:spring-mybatis.xml"/>

      </beans>
      ```

# 请求流程源码分析



```java
//获取值
AbstractMessageConverterMethodArgumentResolver.readWithMessageConverters(...)
//如果请求的是json对象
// 会调用 ObjectMapper类的此方法
public <T> T readValue(InputStream src, JavaType valueType)
        throws IOException, JsonParseException, JsonMappingException
    {
        return (T) _readMapAndClose(_jsonFactory.createParser(src), valueType);
    } 
```

