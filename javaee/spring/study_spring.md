# spring

## ����:

?	���������Ʒ�ת��IOC�������������̣�AOP�����������

## ���

?	![spring](D:\java lib\study_spring\springimage\spring.PNG)



## IOC

���壺**���Ʒ�ת**�����ǰ�ԭ�����Ǵ���������Ҫʵ�ֵĶ��󴴽��������Ĵ��룬��ת����������æʵ�֡���		    ô��Ȼ��������Ҫ����һ��������ͬʱ��Ҫһ��������������֪����Ҫ�����Ķ��������Ĺ�ϵ����������������־������ǿ����õ��ļ���

### �ṹ��ϵ

spring ioc �ṩ������ioc������ʵ�֣�BeanFactory  ApplicationContext

![srping_beanfactory](D:\java lib\study_spring\springimage\srping_beanfactory.PNG)

#### BeanFactory

?	��ioc�����Ļ���ʵ�֣��Ƕ���ĸ���ӿڣ���������ʵ������

?	ListableBeanFactory�� �б����bean

?	HierarchicalBeanFactory ���и���̳�ԭ��

?	AutowireCapableBeanFactor���Զ�װ��ԭ��

?	



bean ���壺

?	![spring_bean](D:\java lib\study_spring\springimage\spring_bean.PNG)

?	Bean �Ķ�������������������� Spring �������ļ����㶨��� <bean/> �ڵ������е���Ϣ�����������ӽڵ㡣�� Spring �ɹ������㶨���һ�� <bean/> �ڵ���� Spring ���ڲ��ͱ�ת���� BeanDefinition �����Ժ����еĲ������Ƕ����������ɵġ�



bean ������

?	![spring_beanSolver](D:\java lib\study_spring\springimage\spring_beanSolver.PNG)



#### ApplicationContext

?	��BeanFactoryʵ������**���**����������ʵ����

?			�CClassPathXmlApplicationContext������·���¼��������ļ�

?			�CFileSystemXmlApplicationContext:���ļ�ϵͳ�м��������ļ�

?	��չ��

?		ConfigurableApplicationContext������close()��refresh() ������applicationContext��ˢ��

?		WebApplicationContext����ר��ΪWEBӦ�ö�׼���ģ�������������WEB��Ŀ¼��·�������			   ��ʼ������

### 	�Զ�װ��

#### ԭ��

?	ע����ࣺͨ�����ԡ�ͨ��������ע��

?	����ע�룺

?		1.**byName**: ��Spring�����л�ȡĿ�����ʱ��Ŀ������е����Ի��������������Spring�����в���<bean>��ǩ��id����ֵ���������ͬ�ģ���ô��ȡ�������ʵ�ֹ���������Spring��������ʾ���е�spring�����ļ��в��ң���ôid�������ظ��ġ� 

?		2.**byType** ->��Spring�����л�ȡĿ�����ʱ��Ŀ������е����Ի��������������spring�����в���<bean>��ǩ��class����ֵ���������ͬ�ģ���ô��ȡ�������ʵ�ֹ���

?	������ע�룺

?		�൱��ͨ��byType��ʽ

#### ע��װ��

?	@Inject����@Resource���ʹ��

?	@Resource����@Quality��ϸ���bean��id������

?	@AutoWired:Ĭ�ϸ�������ȥ��



## AOP

���壺����������

?	�ײ��Ƕ�̬����

?AspectJ ֧��5�����͵�֪ͨע��:

?	�C@Before: ǰ��֪ͨ,�ڷ���ִ��֮ǰִ��

?	�C@After: ����֪ͨ,�ڷ���ִ��֮��ִ��

?	�C@AfterRunning: ����֪ͨ,�ڷ������ؽ��֮��ִ��

?	�C@AfterThrowing: �쳣֪ͨ,�ڷ����׳��쳣֮��

?	�C@Around: ����֪ͨ,Χ���ŷ���ִ��



��������ȼ���@Order



bean֮��Ĺ�ϵ

	�̳У�ͨ����beanʵ��������ʱָ������parent��... ʵ�ּ̳У�
			<bean class="entity.Role" id="role">
				<constructor-arg value="1" type="java.lang.Integer" name="roleId"/>
			</bean>
	
			<bean id="subRole" parent="role"/>
	
			���һ��beanû�м̳��κθ��࣬û��ָ��class����ô���bean�����ǳ����bean��
			ֻҪ��abstract��������Ϊtrue����
			<bean id="subRole" parent="role" abstract="true" />
			
	������������bean������depend-on������ʵ��������������bean�����ڱ�����bean����ǰ������
			<bean class="entity.Employee" id="employee3" depends-on="role">
				<property name="empName" value="jack"/>
			</bean>
# 		Springע������

## ��� 

### spring ע����������ַ�ʽ��

- һ��ComponentScan   + Configuration  ע��

1.@ComponentScan   ָ��ɨ���

2.@Bean  ָ����ʼ�����١���ʼ��������ʽ��BeanPostProcessor

3.@Configuration �൱�������ļ���һ������һ�������ļ���

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


�Զ���ɨ�����

- [ ] ```java
      @Configuration  //����Spring����һ��������

      @ComponentScans(
      		value = {
      				@ComponentScan(value="com.atguigu",includeFilters = {
      /*						@Filter(type=FilterType.ANNOTATION,classes={Controller.class}),
      						@Filter(type=FilterType.ASSIGNABLE_TYPE,classes={BookService.class}),*/
      						@Filter(type=FilterType.CUSTOM,classes={MyTypeFilter.class})
      				},useDefaultFilters = false)	
      		}
      		)
      //@ComponentScan  value:ָ��Ҫɨ��İ�
      //excludeFilters = Filter[] ��ָ��ɨ���ʱ����ʲô�����ų���Щ���
      //includeFilters = Filter[] ��ָ��ɨ���ʱ��ֻ��Ҫ������Щ���
      //FilterType.ANNOTATION������ע��
      //FilterType.ASSIGNABLE_TYPE�����ո��������ͣ�
      //FilterType.ASPECTJ��ʹ��ASPECTJ���ʽ
      //FilterType.REGEX��ʹ������ָ��
      //FilterType.CUSTOM��ʹ���Զ������
      public class MainConfig {
      	
      	//��������ע��һ��Bean;����Ϊ����ֵ�����ͣ�idĬ�����÷�������Ϊid
      	@Bean("person")
      	public Person person01(){
      		return new Person("lisi", 20);
      	}

      }
      ```

- ����@Importע��

  ?	�÷���

  ?		@Import({Role.class....})��

  ?		ֱ��ʵ��ImportSelector�ӿڽ�ע�����ȫ�����������з���

+ ����@Bean

  �����ڵ����ⲿ�����

- �ġ��Զ���factoryBean

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

        	//�Ƿ��ǵ���
            @Override
            public boolean isSingleton() {
                return false;
            }
        }

        //ע��ʱ��
         @Bean("employee")
            public MyFactoryBean myFactoryBean(){
                return new MyFactoryBean(Employee.class);
            }
         @Bean("role")
            public MyFactoryBean myFactoryBean(){
                return new MyFactoryBean(Role.class);
            }

        ```

  - �塢@Conditional

    ����������̬�Ļ�ȡע�����

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
         * @Desciption: �жϵ�ǰ�����л����ǲ���windowsϵͳ
         */
    
        public class LinuxCondition implements Condition{
            @Override
            public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    
                //��ȡ��IOCʹ�õ�beanFactory
                ConfigurableListableBeanFactory configurableListableBeanFactory =
                        context.getBeanFactory();
                //��ȡ��ǰ���������
                ClassLoader classLoader = context.getClassLoader();
                //��ǰ�Ļ�������
                Environment environment = context.getEnvironment();
                //ע�����
                BeanDefinitionRegistry beanDefinitionRegistry = context.getRegistry();
    
                String osName = environment.getProperty("os.name");
    
                if(osName.contains("linux")){
    
                    return true;
                }
    
                return false;
            }
        }
    
        ```

  ## �������������

  ?

��ʼ����

?	��ʵ����ִ�й�����

?	��ʵ������ִ��

����

?	��ʵ����ִ��

?	��ʵ����ִ��

����

?	��ʵ������ioc����������ioc�����������ٵ�ʱ��

?	��ʵ��������ioc��������

- @Bean

  ?	��bean���Զ���init��destroy����

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


- ʵ��DisposableBean��InitializingBean�ӿڣ����١�������

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

  ## ���Ը�ֵ

  ?


- @Valueע��

  ## �Զ�װ��

  ```java
  @Autowired
  @Inject
  @Resource
  ```
  ## AOP



- ���裺

  ?	1.����Ҫ��������ǿ����

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

  ?	2.����������

  ?	3.��������ǿ��֯����������

  ?		

  - [ ] ```java
        /*
        *	�����е�joinPoint������ڵ�һ��
        *
        */
        @Aspect
        public class PointEntity {

            @Pointcut("execution(* SpringAnnotationDriver.aop.TestEntity.test(..))")
            public void pointMethod(){}

            @Before(value = "pointMethod()")
            public void logStart(JoinPoint joinPoint){
                System.out.println("Before���еķ�����...."+joinPoint.getSignature().getName()+
                        "���в���.."+ Arrays.asList(joinPoint.getArgs())
                );
        }

            @After("pointMethod()")
            public void logEnd(JoinPoint joinPoint){

                System.out.println("after "+joinPoint.getSignature().getName()+"���н���");

            }

            @AfterReturning(value = "pointMethod()",returning = "result")
            public void logReturn(JoinPoint joinPoint,Object result){

                System.out.println("AfterReturning  "+joinPoint.getSignature().getName()+
                        "�������н��������....."+result);

            }

            @AfterThrowing(value = "pointMethod()",throwing = "ex")
            public void logThrow(JoinPoint joinPoint,Exception ex){

                System.out.println("AfterThrowing "+joinPoint.getSignature().getName()+
                        "��������ʱ�쳣.."+ex
                );

            }


        }
  ```

  ?	

  ?	4.��������ͱ�������ǿ��ע����ioc������

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







## ����

1.����Ҫ���������dao��ķ����ϼ���@Transactional

2.���������ϼ�ע��@EnableTransactionManagement

3.��ioc������ע��

```java
 @Bean
    public PlatformTransactionManager platformTransactionManager(){
        return new DataSourceTransactionManager(DataSource);
    }
```

ԭ��

- [ ] ```java
      ԭ��
       * 1����@EnableTransactionManagement
       * 			����TransactionManagementConfigurationSelector�������лᵼ�����
       * 			�����������
       * 			AutoProxyRegistrar
       * 			ProxyTransactionManagementConfiguration
       * 2����AutoProxyRegistrar��
       * 			��������ע��һ�� InfrastructureAdvisorAutoProxyCreator �����
       * 			InfrastructureAdvisorAutoProxyCreator����
       * 			���ú��ô����������ڶ��󴴽��Ժ󣬰�װ���󣬷���һ�����������ǿ�������������ִ�з������������������е��ã�
       * 
       * 3����ProxyTransactionManagementConfiguration ����ʲô��
       * 			1����������ע��������ǿ����
       * 				1����������ǿ��Ҫ������ע�����Ϣ��AnnotationTransactionAttributeSource��������ע��
       * 				2����������������
       * 					TransactionInterceptor������������������Ϣ�������������
       * 					����һ�� MethodInterceptor��
       * 					��Ŀ�귽��ִ�е�ʱ��
       * 						ִ������������
       * 						������������
       * 							1�����Ȼ�ȡ������ص�����
       * 							2�����ٻ�ȡPlatformTransactionManager���������û�����ָ���κ�transactionmanger
       * 								���ջ�������а������ͻ�ȡһ��PlatformTransactionManager��
       * 							3����ִ��Ŀ�귽��
       * 								����쳣����ȡ������������������������ع�������
       * 								�������������������������ύ����
      ```


