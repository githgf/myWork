# TestNG

类似于Junit的测试框架，但是比junit更加的灵活

官网：https://testng.org/doc/documentation-main.html#introduction



## 运行的方式

- With a `testng.xml` file           直接run as test suite
- [With ant](http://testng.org/doc/ant.html)                                    使用ant
- From the command line           从命令行
- IDE                                    直接在IDE中执行（这里的IDE是指编译器）



## testng.xml

组成结构树：	

**suite**（套件，代表一次运行，只能有一个）
**--tests**（运行的测试实例，可以有多个）
**----parameters**（公用的参数设置，相当于在这个测试实例中通用的参数）
**----groups**（指定分组）
**------definitions------runs**
**----classes**（指定运行的类，大部分情况必须指定）

**-----method**(运行类中的方法)

### suite

| 参数                         | 说明                                       | 使用方法                              | 参数值                                      |
| -------------------------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| **name**                   | 必选项，<suite>的名字，将出现在reports里              | name="XXX"                        | suite名字                                  |
| junit                      | 是否执行Junit模式(识别setup()等)                  | junit="true"                      | true和false，默认false                       |
| **verbose**                | 控制台输出的详细内容等级,0-10级（0无，10最详细）             | verbose="5"                       | 0到10                                     |
| **parallel**               | 是否在不同的线程并行进行测试，要与thread-count配套使用        | parallel="mehods"                 | 详见表格下内容，默认false                          |
| parent-module              | 和Guice(依赖注入)框架有关，只运行一次，创建一个parent injector给所有guice injectors |                                   |                                          |
| guice-stage                | 和Guice框架有关                               | guice-stage="DEVELOPMENT"         | DEVELOPMENT，PRODUCTION，TOOL，默认"DEVELOPMENT" |
| configfailurepolicy        | 测试失败后是再次执行还是跳过，值skip和continue            | configfailurepolicy="skip"        | skip、continue，默认skip                     |
| thread-count               | 与parallel配套使用，线程池的大小，决定并行线程数量            | thread-count="10"                 | 整数，默认5                                   |
| annotations                | 获取注解，值为javadoc时，使用JavaDoc的注释；否则用JDK5注释   | annotations="javadoc"             | javadoc                                  |
| time-out                   | 设置parallel时，终止执行单元之前的等待时间（毫秒）            | time-out="10000"                  | 整数，单位毫秒                                  |
| skipfailedinvocationcounts | 是否跳过失败的调用                                | skipfailedinvocationcounts="true" | true和false，默认false                       |
| data-provider-thread-count | 并发时data-provider的线程池数量                   | data-provider-thread-count="5"    | 整数                                       |
| object-factory             | 一个实现IObjectFactory接口的类，实例化测试对象           | object-factory="classname"        | 类名                                       |
| allow-return-values        | 是否允许返回函数值                                | all-return-values="true"          | true和false                               |
| **preserve-order**         | 是否按照排序执行                                 | preserve-order="true"             | true和false，默认true                        |
| group-by-instances         | 按照实例分组                                   | group-by-instances="true"         | true和false，默认false                       |

parallel必须和thread-count配套使用，否则相当于无效参数，thread-count决定了并行测试时开启的线程数量

parallel可选择的方法：

parallel="mehods"  TestNG将并行执行所有的测试方法在不同的线程里

parallel="tests"  TestNG将并行执行在同一个<test>下的所有方法在不同线程里

parallel="classes"  TestNG将并行执行在相同<class>下的方法在不同线程里

parallel="instances"  TestNG将并行执行相同实例下的所有方法在不同的线程里



### tests

| 参数                         | 说明                                     | 使用方法                              | 参数值                       |
| :------------------------- | :------------------------------------- | :-------------------------------- | :------------------------ |
| name                       | test的名字，将出现在报告里                        | name="testname"                   | test的名字                   |
| junit                      | 是否按照Junit模式运行                          | junit="true"                      | true和false，默认false        |
| verbose                    | 控制台输出的详细内容等级,0-10级（0无，10最详细），不在报告显示    | verbose="5"                       | 0到10                      |
| parallel                   | 是否在不同的线程并行进行测试，要与thread-count配套使用      | parallel="mehods"                 | 与suite的parallel一致，默认false |
| thread-count               | 与parallel配套使用，线程池的大小，决定并行线程数量          | thread-count="10"                 | 整数，默认5                    |
| annotations                | 获取注解，值为javadoc时，使用JavaDoc的注释；否则用JDK5注释 | annotations="javadoc"             | javadoc                   |
| time-out                   | 设置parallel时，终止执行单元之前的等待时间（毫秒）          | time-out="10000"                  | 整数，单位毫秒                   |
| enabled                    | 标记是否执行这个test                           | enabled="true"                    | true和false，默认true         |
| skipfailedinvocationcounts | 是否跳过失败的调用                              | skipfailedinvocationcounts="true" | true和false，默认false        |
| preserve-order             | 是否按照排序执行，如果是true，将按照xml文件中的顺序去执行       | preserve-order="true"             | true和false，默认true         |
| allow-return-values        | 是否允许返回函数值                              | all-return-values="true"          | true和false，默认false        |

在suite中可以有多个tests

### **parameter**

说明：提供测试数据，有name和value两个参数

声明方法：<parameter name = "parameter_name" value = "parameter_value "/>

testng.xml文件中的<parameter>可以声明在<suite>或者<test>级别，在<test>下的<parameter>会覆盖在<suite>下声明的同名变量

声明：

```xml
<parameter name="key1" value="run......" />
<parameter name="key2" value="run go......" />
```

引用

```java
@Test(groups = {"group2"})
    @Parameters({"key1","key2"})
    public void testSecond(String key1,String key2){
        System.out.println("<<<<<<<<<<<<<<<<<<<<<<<test2 "+
                           key1 + key2 
                           +">>>>>>>>>>>>>>>>>>");
    }
```

支持的类型：	

**Stringint/Integer**

**boolean/Boolean**

**byte/Byte**

**char/Character**

**double/Double**

**float/Float**

**long/Long**

**short/Short**

### groups

说明：要运行的组，可以自定义一个组，可以包括要执行的，还排除要执行的方法。必须和<classes>配套使用，从下面的类中找到对应名字的方法

<groups>由<difine>和<run>、<dependencies>三部分组成。<diffine>可以将group组成一个新组，包括要执行和不执行的大组；<run>要执行的方法；<dependencies>指定了某group需要依赖的group（比如下面的例子，group1需要依赖group2和group3先执行）。

声明方法：

```xml
<groups>
     <define name ="all">
          <include name ="testgroup1"/>
          <exclude name ="testgroup2'/>
     </define>
     <run>
          <include name ="all"/>
          <include name ="testmethod1"/>
          <exclude name="testmethod2"/>
     </run>
     <dependencies>
          <group name ="group1" depends-on="goup2 group3"/>
     </dependencies>
</groups>

```



 

### classes

说明：方法选择器，要执行的方法写在这里，参数有name和priority。

注释：

1.<classes>下必须写要执行的<class>，否则不会执行任何内容，如果填写了class没有写methods，会按照填写的class的下的注释@Test去执行所有的方法

2.<classes>下的<methods>如果填写了<include>，那只会执行所填写的方法，没有填写的方法不会去执行

 

声明方法：

```xml
<classes>
    <class name="要执行的class名">
          <methods>
               <include name ="要执行的方法名"></include>
          </methods>
     </class> 
</classes>

```



 

### packages

说明：<packages>指定包名代替类名。查找包下的所有包含testNG annotation的类进行测试

声明方法：

```xml
<packages>
     <package name="packagename"/>
     <package name="packagename">
          <include name="methodname"/>
          <exclude name="methodname"/>
     </package>
</packages>

```

### listener

说明：指定listeners，这个class必须继承自org.testng.ITestNGListener。在Java中使用@Listeners({com.example.MyListener.class,com.example.MyMethodInterceptor.class})的注释也可以有同样效果

声明方法：

```xml
<listeners>
     <listener class-name="com.example.MyListener"/>
     <listener class-name="com.example.MyMehodIntercepor"/>
</listeners>

```

## 注解：

### 一般注解

官网原版：

**@BeforeSuite: **The annotated method will be run before all tests in this suite have run. 

翻译：被注解的方法会在一个套件（suite）运行时前，只能运行一次，也就是<suite>标签内所有方法运行前

**@AfterSuite: **The annotated method will be run after all tests in this suite have run. 

翻译：被注解的方法会在一个套件（suite）运行时前，只能运行一次，也就是<suite>标签内所有方法运行后

**@BeforeTest**: The annotated method will be run before any test method belonging to the classes inside the <test> tag is run. 

翻译：被注解的方法会在一个测试用例也就是<test>标签中所有方法运行前执行

**@AfterTest**: The annotated method will be run after all the test methods belonging to the classes inside the <test> tag have run. 

翻译：被注解的方法会在一个测试用例也就是<test>标签中所有方法运行后执行

**@BeforeGroups**: The list of groups that this configuration method will run before. This method is guaranteed to run shortly before the first test method that belongs to any of these groups is invoked. 

翻译：被注解的方法会在一个测试用例也就是<group>标签中所有方法运行后执行

**@AfterGroups**: The list of groups that this configuration method will run after. This method is guaranteed to run shortly after the last test method that belongs to any of these groups is invoked. 

翻译：被注解的方法会在一个测试用例也就是<group>标签中所有方法运行后执行

**@BeforeClass**: The annotated method will be run before the first test method in the current class is invoked. 

翻译：被注解的方法会在当前类第一个测试方法运行前执行

**@AfterClass**: The annotated method will be run after all the test methods in the current class have been run. 

翻译：被注解的方法会在当前类第一个测试方法运行前执行

**@BeforeMethod**: The annotated method will be run before each test method. 

翻译：被注解的方法会在每一个测试方法之前执行

**@AfterMethod**: The annotated method will be run after each test method.

翻译：被注解的方法会在每一个测试方法之后执行



#### 属性：

以上方法都有以下参数

alwaysRun：

​	For before methods (beforeSuite, beforeTest, beforeTestClass and beforeTestMethod, but not 			      beforeGroups): If set to true, this configuration method will be run regardless of what groups it belongs to. For after methods (afterSuite, afterClass, ...): If set to true, this configuration method will be run even if one or more methods invoked previously failed or was skipped.

翻译：对那些被运行之前注解注释的方法（除了beforeGroups）来说，只要设置为true，此方法就一定会执行

​		对那些被运行之后注解注释的方法来说，只要设置为true，不管当前类中方法有没有执行或者执行失败都会执行此方法

dependsOnGroups  

 	The list of groups this method depends on.

翻译：依赖的组，也就是说依赖的组测试失败此方法跳过

dependsOnMethods

​	The list of methods this method depends on.

翻译：依赖的方法，也就是说依赖的方法测试失败此方法跳过

enabled  

​	Whether methods on this class/method are enabled.

翻译：是否使用

groups

​	 The list of groups this class/method belongs to.

翻译：分组

  `inheritGroups`  If true, this method will belong to groups specified in the @Test annotation at the class level.

 `onlyForGroups`  Only for @BeforeMethod and @AfterMethod. If specified, then this setup/teardown method will only be invoked if the corresponding test method belongs to one of the listed groups.



### 最常用注解：

##### **@DataProvider** 

数据源，被此注解标注的方法表示自定义的数据，返回值为Object[ ][ ]二维数组类型，可以被其他测试方法引用值

```java
 @DataProvider(name = "dataProviderValue")
    public Object[][] getDataProvider(){
        Object[][] values = new Object[][]{
                {"name1","pass1"},
                {"name2","pass2"},
          		{"name3","pass3"}
        };
        return values;
    }

 @Test(dataProvider = "dataProviderValue",groups = {"group2"})
    public void testDataProviderCus(String zero,String first){
        System.out.println("key ==== " + zero.toString() + "  value ===== " + first);
    }

方法的参数就是dataProvider数据源二维数组中一维数组的长度，执行次数为一位数组的个数，
比如说上文的执行结果是
key ==== name1  value ===== pass1
key ==== name2  value ===== pass2
key ==== name3  value ===== pass3
```

属性：

​	name		数据源名，被引用时必须用此name

​	parallel		如果为true，适用于并发测试

##### @Parameters

​	引用参数

##### @Factory

​	标记方法作为一个返回对象的工厂，这些对象将被TestNG用于作为测试类。这个方法必须返回Object[]

​	通俗讲就是类似于工厂模式根据构造器产生不同测试实例，运行相同方法但是参数不同的测试

```java
//工厂类
public class TestFactory {
    @Factory
    public Object[] testFactory(){
        return
                new Object[]{
                        new EmployeeMapperTest("jack"),
                        new EmployeeMapperTest("lucy")
                };
    }
}
//产生的运行实例
public class EmployeeMapperTest {
    public String name;
    public EmployeeMapperTest(String name){
        this.name = name;
    }
  
    @Test
    public void testName(){
        System.out.println("name ===========>>>" + name);
    }

}
```

这样只需要在testng.xml中配置如下，即可运行两个测试方法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="testFactory">
    <test name="test1" verbose="1">
        <classes>
            <class name="cn.hgf.springdemo.mapper.TestFactory" />
        </classes>
    </test>
</suite>
```

##### @Listeners

类似于拦截器，要求类必须实现一些接口其中之一

- `IAnnotationTransformer` ([doc](http://testng.org/doc/documentation-main.html#annotationtransformers),[javadoc](https://jitpack.io/com/github/cbeust/testng/master/javadoc/))
- `IAnnotationTransformer2` ([doc](http://testng.org/doc/documentation-main.html#annotationtransformers),[javadoc](http://testng.org/javadocs/org/testng/IAnnotationTransformer2.html))
- `IHookable` ([doc](http://testng.org/doc/documentation-main.html#ihookable),[javadoc](http://testng.org/javadocs/org/testng/IHookable.html))
- `IInvokedMethodListener` (doc, [javadoc](http://testng.org/javadocs/org/testng/IInvokedMethodListener.html))
- `IMethodInterceptor` ([doc](http://testng.org/doc/documentation-main.html#methodinterceptors),[javadoc](http://testng.org/javadocs/org/testng/IMethodInterceptor.html))
- `IReporter` ([doc](http://testng.org/doc/documentation-main.html#logging-reporters),[javadoc](http://testng.org/javadocs/org/testng/IReporter.html))
- `ISuiteListener` (doc, [javadoc](http://testng.org/javadocs/org/testng/ISuiteListener.html))
- `ITestListener` ([doc](http://testng.org/doc/documentation-main.html#logging-listeners),[javadoc](http://testng.org/javadocs/org/testng/ITestListener.html))  以上所有类的父类

demo：

监听类：

```java
public class TestNGInterceptor implements IMethodInterceptor {
    @Override
    public List<IMethodInstance> intercept(List<IMethodInstance> list, ITestContext iTestContext) {

        for (IMethodInstance iMethodInstance : list) {

            ITestNGMethod method = iMethodInstance.getMethod();
            System.out.println(method.getMethodName());
        }

        return list;
    }
}
```

测试类

```java
@Listeners({TestNGInterceptor.class})
public class EmployeeMapperTest {
@Test(groups = {"group1"})
    public void testMain(){
        System.out.println("<<<<<<<<<<<<<<<<<<<<<<<<test>>>>>>>>>>>>>>>>");
    }

    @Test
    public void testName(){
        System.out.println("name ===========>>>");
    }
}
```



最终结果会在测试实例运行之前运行此方法

##### @Test

除了一般注释有的属性，其还有以下属性

dataProvider					指明数据源，必须存在有@DataProvider注解的方法

dataProviderClass				配合dataProvider使用，指明产生数据源的类，如果没有被指定，则会在当前			                            类中寻找@DataProvider注解的方法

description					描述

expectedExceptions			指定异常列表，如果此方法运行时没有异常或者抛出的异常和指定列表不同则此测试方法表示失败

invocationCount				调用次数

priority						执行优先级，也就是顺序，数字越大，越晚执行

successPercentage				预期成功的百分比

singleThreaded				如果设置为true，那么所有在这个类中的测试方法将在一个线程中运行

threadPoolSize 				表示此方法执行需要的线程数量

timeOut						表示执行此方法需要的时间如果超时表示运行失败



## 各种测试样例

### 并行测试：

被测试类

```java
public class TestNGThread {
    @Test
    public void testName() {
        System.out.println("[testName]" + LocalDateTime.now().toString() + "  current  thread is " + Thread.currentThread().getId());
    }
}
```

目的：

​	让testName这个方法在不同的线程中同时运行

方法一：

​	在testName@Tets中添加配置(threadPoolSize = 3,invocationCount = 3,timeOut = 2000)

TestNG.xml 或者直接点击运行

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="testThread">
    <test name="test1" verbose="1">
        <classes>
            <class name="cn.hgf.springdemo.common.testng.TestNGThread">
                <methods>
                    <include name="testName" />
                </methods>
            </class>
        </classes>
    </test>
</suite>
```

方法二：

​	在配置文件中将同一个方法放在不同的test实例下,在suite中配置多线程同时运行方法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="testThread" parallel="tests" thread-count="3">
    <test name="test1" verbose="1">
        <classes>
            <class name="cn.hgf.springdemo.common.testng.TestNGThread">
                <methods>
                    <include name="testName" />
                </methods>
            </class>
        </classes>
    </test>

    <test name="test2" verbose="1">
        <classes>
            <class name="cn.hgf.springdemo.common.testng.TestNGThread">
                <methods>
                    <include name="testName" />
                </methods>
            </class>
        </classes>
    </test>

</suite>
```



​	

## 生成测试报告

在testng的设置中点击listeners中的  Use default reports

Output diectory中的路径就是测试报告存放的路径







