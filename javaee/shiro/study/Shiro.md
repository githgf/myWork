

# **Shiro**



## 原理



## 组成部分

![shiro_content](D:\java lib\shiro\shiro_content.PNG)

- Authentication（身份验证登录）：判断用户是否具有相应的身份
- Authorization（权限验证）：验证某个已经验证的用户是否拥有权限，也就是判断用户能进行什么操作
- SessionManagement（会话管理）：用户登陆后所有的信息都在会话中，支持javaSE，javaEE
- Cryptography（加密）：密码不是明文存储在数据库中
- Web Support（Web 支持）：非常容易集成在web环境中
- Caching（缓存）：用户登陆后相同信息不用每次查找
- Concurrency（多线程）：支持多线程并发验证，自动传送权限
- Testing（测试）：
- Run As：在用户允许的情况下，一个用户可以假装为另一个用户
- Remember Me：记住用户名密码

## 外部架构

![外部架构](D:\java lib\shiro\外部架构.PNG)

- Subject（当前用户）：相当于门面，直接与用户交互
- Shiro Security Manager（安全管理器）：相当于spring mvc 中的前端处理器 DispectherServlet
- Realm： shiro从realm中获取用户的数据，相当于DataSource

## 内部架构

![内部](D:\java lib\shiro\内部架构.PNG)

- Subject：任何可以与应用交互的“用户”；

- Security Manager：相当于Spring MVC 中的 DispatcherServlet；是 Shiro 的心脏；

  ​				所有具体的交互都通过 Security Manager进行控制；它管理着所有 Subject、且负责进

  ​				行认证、授权、会话及缓存的管理。

-  Authenticator：     负责 Subject 认证，是一个扩展点，可以自定义实现；可以使用认证

  ​				策略（Authentication Strategy），即什么情况下算用户认证通过了；

-  Authorizer：         授权器、 即访问控制器，用来决定主体是否有权限进行相应的操作；即控

  ​				制着用户能访问应用中的哪些功能；

-  Realm：                可以有 1 个或多个 Realm，可以认为是安全实体数据源，即用于获取安全实体

  ​		 		的；可以是JDBC 实现，也可以是内存实现等等；由用户提供；所以一般在应用中

  ​				都需要实现自己的 Realm；

-  SessionManager：管理 Session 生命周期的组件；而 Shiro 并不仅仅可以用在 Web

  ​				环境，也可以用在如普通的 Java SE环境

-  CacheManager：  缓存控制器，来管理如用户、角色、权限等的缓存的；因为这些数据

  ​			       基本上很少改变，放到缓存中后可以提高访问的性能

- Cryptography：    密码模块，Shiro 提高了一些常见的加密组件用于如密码加密/解密。 


## 	Shiro集成Spring MVC

- web.xml

  ​	Shiro filter 配置

  ```xml
   <filter>
      <filter-name>shiroFilter</filter-name>
      <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
      <init-param>
        <param-name>targetFilterLifecycle</param-name>
        <param-value>true</param-value>
      </init-param>
    </filter>

    <filter-mapping>
      <filter-name>shiroFilter</filter-name>
      <url-pattern>/*</url-pattern>
    </filter-mapping>
  ```

Spring - Shiro .xml

- [ ] ```xml

          <!--
          1. 配置 SecurityManager!
          -->

          <bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
              <property name="cacheManager" ref="cacheManager"/>
              <property name="authenticator" ref="authenticator"/>

              <property name="realms">
                  <list>
                      <ref bean="jdbcRealm"/>
                      <!--<ref bean="secondRealm"/>-->
                  </list>
              </property>

              <property name="rememberMeManager" ref="rememberMeManager"/>
          </bean>

          <!--配置cookie-->
          <bean class="org.apache.shiro.web.servlet.SimpleCookie" id="cookieManager">
              <constructor-arg value="rememberMe"/>
              <property name="httpOnly" value="true"/>
              <!--时间-->
              <property name="maxAge" value="10"/>
          </bean>

          <!--配置记住我管理器-->
          <bean class="org.apache.shiro.web.mgt.CookieRememberMeManager" id="rememberMeManager">
              <!--加密算法-->
              <property name="cipherKey" value="#{T(org.apache.shiro.codec.Base64).decode('4AvVhmFLUs0KTA3Kprsdag==')}" />
              <property name="cookie" ref="cookieManager"/>
          </bean>

          <!--
          2. 配置 CacheManager.
          2.1 需要加入 ehcache 的 jar 包及配置文件.
          -->
          <bean id="cacheManager" class="org.apache.shiro.cache.ehcache.EhCacheManager">
              <property name="cacheManagerConfigFile" value="classpath:ehcache.xml"/>
          </bean>

          <bean id="authenticator"
                class="org.apache.shiro.authc.pam.ModularRealmAuthenticator">
              <property name="authenticationStrategy">
                  <bean class="org.apache.shiro.authc.pam.AtLeastOneSuccessfulStrategy"></bean>
              </property>
          </bean>

          <!--
          	3. 配置 Realm
          	3.1 直接配置实现了 org.apache.shiro.realm.Realm 接口的 bean
          -->
          <bean id="jdbcRealm" class="shiro.realms.firstRealm">
              <property name="credentialsMatcher" ref="credentialsMatcher"/>
          </bean>

          <!--密码加密-->
          <bean class="org.apache.shiro.authc.credential.HashedCredentialsMatcher" id="credentialsMatcher">
              <!--加密次数-->
              <property name="hashIterations" value="12"/>
              <property name="hashAlgorithmName" value="MD5"/>
          </bean>

          <!--
          4. 配置 LifecycleBeanPostProcessor. 可以自定的来调用配置在 Spring IOC 容器中 shiro bean 的生命周期方法. AOP式方法级权限检查
          -->
          <bean id="lifecycleBeanPostProcessor" class="org.apache.shiro.spring.LifecycleBeanPostProcessor"/>

          <!-- Enable Shiro Annotations for Spring-configured beans.  Only run after
               the lifecycleBeanProcessor has run: -->
          <!--
          5. 启用 IOC 容器中使用 shiro 的注解. 但必须在配置了 LifecycleBeanPostProcessor 之后才可以使用.
          -->
          <bean class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator"
                depends-on="lifecycleBeanPostProcessor"/>

          <bean class="org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor">
              <property name="securityManager" ref="securityManager"/>
          </bean>
  ```


- [ ] ```xml
            <!--
            6. 配置 ShiroFilter.
            6.1 id 必须和 web.xml 文件中配置的 DelegatingFilterProxy 的 <filter-name> 一致.
                              若不一致, 则会抛出: NoSuchBeanDefinitionException. 因为 Shiro 会来 IOC 容器中查找和 <filter-name> 名字对应的 filter bean.
            -->
            <bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">
                <property name="securityManager" ref="securityManager"/>
                <property name="loginUrl" value="jsp/login.jsp"/>
                <property name="successUrl" value="jsp/index.jsp"/>
                <property name="unauthorizedUrl" value="/jsp/unauthorized.jsp"/>
                <!--<property name="filterChainDefinitionMap" ref="filterChainDefinitionMap"/>-->
                <!--
                	配置哪些页面需要受保护.
                	以及访问这些页面需要的权限.
                	1). anon 可以被匿名访问
                	2). authc 必须认证(即登录)后才可能访问的页面.
                	3). logout 登出.
                	4). roles 角色过滤器
                -->
                <property name="filterChainDefinitions">
                    <value>
                        /jsp/login.jsp = anon
                        /shiro/login = anon
                        /login/logout = logout
                      
                        /shiro/add = perms["role:add"]
                        /shiro/delete = perms["supplier:delete"]
                        # everything else requires authentication:
                        /** = authc
                    </value>
                </property>
            </bean>

            <!--<bean id="filterChainDefinitionMap"-->
                  <!--factory-bean="filterChainDefinitionMapBuilder" factory-method="buildFilterChainDefinitionMap"/>-->

            <!--<bean id="filterChainDefinitionMapBuilder"-->
                  <!--class="factory.FilterChainDefinitionMapBuilder"></bean>-->
    ```



- 权限控制详情

  ​	1.基于URL地址的控制

  ​		

  - [ ] ```xml
         /shiro/addEmployee = perms["emp:add"]
         ```
        ​```

        	 perms["emp:add"]只是储存在shrio中的权限名，但是一般来说要用这种格式规范，可以理解
        为职工管理中的添加用户权限数据库中可以对应employee一级权限下的add权限参数可以写多个
        ```


  - [ ] ```jsp
         /shiro/addEmployee = roles["admin"]
         	/shiro/deleteEmployee = roles["testMen"]
         ```
        ​```

        	表示添加员工的必须要有admin角色，删除员工要有testMen角色



        	2.shiro标签库

​        	

        ​```jsp
        <%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
        ​```

​        	

        ​```jsp
        <shiro:hasRole name="ROLE_ADMIN">
            <li class="user"><a href="admin/user">用户</a></li>
        </shiro:hasRole>
        <shiro:hasAnyRoles name="ROLE_ADMIN,ROLE_SERVICE">//有其中之一就可以
            <li class="complaint"><a href="admin/complaint/list">服务</a></li>
        </shiro:hasAnyRoles>
        <shiro:hasRole name="ROLE_ADMIN">
            <li class="system"><a href="admin/repairType/index">系统设置</a></li>
        </shiro:hasRole>
        ​```
    
        	guest标签 ：验证当前用户是否为“访客”，即未认证（包含未记住）的用户。
    
        ​```jsp
        <shiro:guest> 
        Hi there!  Please <a href="login.jsp">Login</a> or <a href="signup.jsp">Signup</a> today! 
        </shiro:guest>
        ​```
    
        	user:  认证通过或已经记住



        ​```jsp
        <shiro:user> 
         
            Welcome back John!  Not John? Click <a href="login.jsp">here<a> to login. 
         
        </shiro:user>
        ​```
        	https://www.cnblogs.com/jifeng/p/4500410.html


        ```
默认过滤器

| [ org.apache.shiro.web.filter.authc.AnonymousFilter](javascript:void(0);) | anon              |
| :--------------------------------------- | :---------------- |
| [org.apache.shiro.web.filter.authc.FormAuthenticationFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authc/FormAuthenticationFilter.html) | authc             |
| [ org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authc/BasicHttpAuthenticationFilter.html) | authcBasic        |
| [org.apache.shiro.web.filter.authc.LogoutFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authc/LogoutFilter.html) | logout            |
| [org.apache.shiro.web.filter.session.NoSessionCreationFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/session/NoSessionCreationFilter.html) | noSessionCreation |
| [org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authz/PermissionsAuthorizationFilter.html) | perms             |
| [org.apache.shiro.web.filter.authz.PortFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authz/PermissionsAuthorizationFilter.html) | port              |
| [org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authz/HttpMethodPermissionFilter.html) | rest              |
| [org.apache.shiro.web.filter.authz.RolesAuthorizationFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authz/RolesAuthorizationFilter.html) | roles             |
| [org.apache.shiro.web.filter.authz.SslFilter](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/web/filter/authz/SslFilter.html) | ssl               |
| [org.apache.shiro.web.filter.authc.UserFilter](http://shiro.apache.org/static/1.3.2/apidocs/org/apache/shiro/web/filter/authc/UserFilter.html) | user              |

自定义过滤器

​	![CustomRolesAuthorizationFilter](D:\java lib\shiro\CustomRolesAuthorizationFilter.png)

## Session 管理

shiro 中的session可以再controller层以外的层获取session值

- [ ] ```java
      @Controller
      public class handle{
        @AutoWired
        private ShiroService shiroService;
        
        @RequestMapping
        public void test(HttpSession session){
          
          shiroService.editSession();
        }
      }

      @Service
      public class ShiroServiceImpl(){
        
        public void editSession(){
          Session session = SecurityUtils.getSubject().getSession();
          
        }
        
      }
      ```

