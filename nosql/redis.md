# Redis

## NoSQL

### 概念：

​	NoSQL(NoSQL = Not Only SQL )，意即“不仅仅是SQL”，泛指非关系型的数据库。

​	随着互联网web2.0网站的兴起，传统的关系数据库在应付web2.0网站，特别是超大规模和高并发的SNS类型的web2.0纯动态网站已经显得力不从心，暴露了很多难以克服的问题，而非关系型的数据库则由于其本身的特点得到了非常迅速的发展。NoSQL数据库的产生就是为了解决大规模数据集合多重数据种类带来的挑战，尤其是大数据应用难题，包括超大规模数据的存储。

### 优势：

高性能、易扩展、多样灵活的数据模型

### 	分类

- K-V键值对形式存储：redis、
- 文档型数据库：CouchDB、MongoDB
- 图关系数据库：构建关系图谱（不是图形存储）
- 列存储数据库：Cassandra, HBase

### 分布式缓存的CAP原理

- 传统的数据库的ACID:

  ​原子性（Atomicity）、一致性（Consistency）、持久性（Durability）、独立性（Isolation）

- CAP

  强一致性（Consistency）、可用性（Availability）、分区容错（Partition tolerance）

- 在现实的开发环境中，cap只能3选2，也就是

  ca ： 传统Oracle数据库

  cp：大多数网站架构的选择

  ap： Redis、MongoDB





## 安装、启动：



​	

```kotlin
启动：（我的在redis src目录下）
  redis-server /myredis/redis.conf(配置文件)

  redis-cli -p 6379
关闭：
	shutdown
	exit
选择库(索引从0开始)： select 2
设置值： set ke v1
取值：   get ke
查看当前库中的键值对： keys *
查看当前库键值对数量： dbsize
删除当前库中所有的数据： flushdb
删除所有库中的数据：	  flushall


```

### docker 安装并配置

如果是4.0版本以下可以试试这个，前提是下一个方法不成功，（只成功过一次不确定）

> ```shell
> #拉镜像
> docker pull redis:3.2
> #启动镜像
> docker run 
> 	--name redis-3.2
> 	-p	6379:6379
>     -v /data/redis/db:/data
>     #注意这里的redis.conf是文件夹，如果是文件会启动失败！！！！！
>     -v /opt/redis.conf:/usr/local/ect/redis/redis.conf	
>     -d redis:3.2
>     redis-server /usr/local/ect/redis/redis.conf
>     --appendonly yes
>  #从外部导入并且配置redis.conf文件
>  #修改以下几个方面
>  	1.将bind xxx.xxx.xxx 注释
>  	2.daemonize no 或者整行注释，否则会在容器打开后立即关闭
>  	3.如果设置密码，将requirepass 设置密码
>  #配置文件 复制到  /opt/redis.conf 文件夹下
>  #关闭容器
>  docker stop redis-3.2
>  #重新启动
>  docker start redis-3.2
>  
>
> ```

​	如果是redis-4版本的话如下

```sh
#拉镜像
docker pull redis
#从外部导入并且配置redis.conf文件
#修改以下几个方面
 	1.将bind xxx.xxx.xxx 注释
 	2.daemonize no 或者整行注释，否则会在容器打开后立即关闭
 	3.如果设置密码，将requirepass 设置密码
#配置文件 复制到  /opt/redis.conf/ 文件夹下
#启动镜像
docker run 
	--name redis-4
	-p	6379:6379
	--privileged=true
    -v /data/redis/db:/data
    -v /opt/redis.conf/redis.conf:ect/redis/redis.conf	
    -d redis:4(镜像名)
    redis-server /ect/redis/redis.conf
 	
```





## 五大数据类型：

​	Key（键值对）

​	String（字符串）

​	List（有序集合）

​	Map（map）

​	Set（无序列表）

​	ZSet（和set相类似，前面有分数）



### 	Key

- [ ] ```java

      del keyName 			删除
      type keyName 			查看类型
      ttl keyName 			查看剩余生存时间：-1 永不过期 -2 过期
      expire keyName 20(秒)		设置过期时间

      ```

### String



- [ ] ​

      ```java
      incr strName	 						增加1
      incrby strName num						增加固定数字,前提是数字
      decr strName							减1
      decrby strName num						减少固定数字,前提是数字
      append 									添加字符
      GETRANGE 0,4 							截取
      setex strName 5 "asd"					设置字符串存活时间，相当于创建和设置过期时间一起
      setnx	strName							如果字符串不存在则创建
      mset strName1 value1 strName2 value2  		设置多值
      mget strName1  strName2 					获取多值
      msetnx strName1 value1 strName2 value2 		不存在则设值
      ```


      ```
### List

- [ ] ​

        lpush listName 1 2 3					(3 2 1)
        rpush listName 1 2 3					(1 2 3）
        lrange listName 0 -1					查看所有
        lpop/rpop								移除栈顶元素
        index									下标，从上往下（从0开始）
        llen									长度
        lrem listName 3 3						删除数组中3个3
        ltrim listName 1,2						截取指定数组在赋值给list
        rpoplpush list1 list2					将list1栈地元素放在list2栈顶
        lset listName index value				将数组中指定下标的元素赋值
        linsert listName before/after			在指定元素之前或之后插入

      ### Set

        ```
​      	

        | sadd                   | 向set中添加集合，有重复自动去重              |
        | :--------------------- | :----------------------------- |
        | sismember set value    | 查看元素是否存在于set中                  |
        | smember set            | 查看当前set所有元素                    |
        | scard set              | 查看set中集合个数                     |
        | srem set value         | 删除set中指定元素                     |
        | srandmember num        | 产生一个随机数                        |
        | smove set 1 set2 value | 将set1中的某个值移除赋给set2             |
        | sdiff set1 set2        | set1和set2的差集合，也就是set1有set2没有的值 |
        | sinter                 | 交集                             |
        | sunion                 | 并集                             |
        
        ```


### Map

| hset map id 1                    | 创建一个map 第一个键值对 id 1                      |
| -------------------------------- | :--------------------------------------- |
| hget map id                      | 获取map中 key 为 id的值                        |
| hmset map id 1 name test         | 创建一个map 第一个键值对 id 1，第二为....              |
| hmget map id name                | 获取多值                                     |
| hlen map                         | map长度                                    |
| hkeys map                        | 获取key集合                                  |
| hvals                            | 获取val集合                                  |
| HINCRBY map field increment      | 为map中的相应属性增加指定的整数                        |
| HINCRBYFLOAT key field increment | 为map中的相应属性增加指定的小数                        |
| HSETNX  key field value          | map 中的 `field` 的值设置为 `value` ，当且仅当域 `field` 不存在。 |
  | hgetall                          | 查找所有元素                           

### ZSet

| ZREVRANGEBYSCORE  zset  15 10            | 在zset中根据score逆序排序         |
| ---------------------------------------- | ------------------------- |
| ZRANGEBYSCORE  zset 10 15   （代表小于  ）代表大于  limit 2 2 | 在zset中根据score正向排序         |
| zscore zset v1                           | 获取zset中的v1的score          |
| zcount zset 10 30                        | 获取zset中score在10 30 之间的 数量 |
| zcard zset                               | zset中的数量                  |
| zrank zset v1                            | zset正向下标                  |
| zrevrank zset v1                         | 逆向下标                      |
| zrevrange zset 0 1                       | 逆向查找下标0 1 元素              |
| zrange zset 0 -1                         | 查找所有                      |

## RDB

### 定义：

​	在一定时间间隔内将数据以快照的形式存储在内存中，数据恢复时只需要执行快照文件即可

### 原理：

​	redis会fork一个子进程复制数据，每次复制会产生dump.rdb文件，然后新产生的文件会替换上一次的文件

### 触发条件：

​	1.使用命令：save和bgsave

​		save：只管保存、阻塞

​		bgsave：异步进行快照存储

### 如何恢复：

​	1.将备份文件 (dump.rdb) 移动到 redis 安装目录并启动服务即可

​	2.CONFIG GET dir获取目录

### 劣势：

​	1.间隔一段时间才进行复制，可能会失去最后一次服务器强制下线的数据

​	2.数据量庞大

### 优势：

​	1.适合大规模数据恢复

​	2.适合对完整性和一致性要求不高的数据

## AOF

### 定义：

​	是以日志的形式记录数据写入的每一个操作（只有写入操作生效），redis重启就是将aof文件从头到尾			         			执行一遍（如果最后一次是flush操作也会执行）产生append.aof文件

### 配置

- [ ] ```xml
      # appendfsync always		同步持久化
      appendfsync everysec		异步持久化
      # appendfsync noappend
      ```

### 正常恢复：

​	1.将redis.conf文件中 的appendonly 为yes

​	2.将文件放到redis目录下

​	3.重新加载redis服务

### 异常恢复：

​	1.将redis.conf文件中 的appendonly 为yes

​	2.备份被破坏的aof文件，redis-check-aof   --fix append.aof

​	3.将文件放到redis目录下

​	3.重新加载redis服务

### 重写机制：

#### 	定义：

​	AOF采用文件追加方式，文件会越来越大为避免出现此种情况，新增了重写机制,
当AOF文件的大小超过所设定的阈值时，Redis就会启动AOF文件的内容压缩，
只保留可以恢复数据的最小指令集.可以使用命令bgrewriteaof

#### 	原理：

​	AOF文件持续增长而过大时，会fork出一条新进程来将文件重写(也是先写临时文件最后再rename)，
遍历新进程的内存中数据，每条记录有一条的Set语句。重写aof文件的操作，并没有读取旧的aof文件，
而是将整个内存中的数据库内容用命令的方式重写了一个新的aof文件，这点和快照有点类似



#### 	触发机制：

​	Redis会记录上次重写时的AOF大小，默认配置是当AOF文件大小是上次rewrite后大小的一倍且文件大于64M时触发

​	

- [ ] ```xml
      auto-aof-rewrite-percentage  

      auto-aof-rewrite-min-size

      ```

      ### 优势：

      ​	1.灵活配置：每次修改同步、每秒同步、不同步

      ### 劣势：

      ​	1.相同数据集的数据而言aof文件要远大于rdb文件，恢复速度慢于rdb

      ​	2.aof运行效率要慢于rdb,每秒同步策略效率较好，不同步效率和rdb相同



ps:>>>>>>>>>>>>>>>aof、rdb两文件在回复时优先恢复aof



## Redis 事务

### 定义：

​	一组命令的集合，按顺序执行命令，而不会被其他命令强行插入

正常：

​	MULTI

​	........

​	EXEC

取消：

​	MULTI

​	.......

​	DISCARD

特征：

​	在事务中如果是命令出错则全部不执行；

​	如果是编译出错，那么错误的不执行

watch监控机制

​	在事务执行时如果被监控的对象被修改，事务队列不会执行



## 主从复制

### 定义：

​	行话：也就是我们所说的主从复制，主机数据更新后根据配置和策略，
自动同步到备机的master/slaver机制，Master以写为主，Slave以读为主

### 	配置

配从不配主：

​	复制redis.conf文件，重命名，在文件中修改

- [ ] ```xml
      slaveof <masterip> <masterport>
      ```

读写分离：

​	只有主机才能进行写入操作

​	主机挂机，从机待命

​	每次断开连接，主机上线后从机都需要重新连接



### 哨兵模式（sentinel）：

​	用来监控主机的状态，期间会在一定的间隔时间内和主机保持一定的通信，主机如果挂机，哨兵（sentinel）根据规则会进行投票在其从机下产生新的主机

#### 	配置

​	1.新建sentinel.conf文件在其中写入：

​			port 26379

​			 sentinel monitor <mastername> <masterhost> <mosterport> <投票数>

​	2.启动：	Linux           				redis-sentinel /myredis/sentinel.conf 

​			windows     				redis-server setinel-conf  --sentinel	



## jedis

redis 客户端

​	spring-redis.xml

- [ ] ```xml
      <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:aop="http://www.springframework.org/schema/aop"
             xsi:schemaLocation="http://www.springframework.org/schema/beans
             http://www.springframework.org/schema/beans/spring-beans.xsd
             http://www.springframework.org/schema/aop
             http://www.springframework.org/schema/aop/spring-aop.xsd">
          <!--****************************redis缓存配置********************************************-->
          <bean class="redis.clients.jedis.JedisPoolConfig" id="poolConfig">
              <property name="maxIdle" value="300" />
              <property name="maxTotal" value="600" />
              <property name="maxWaitMillis" value="5000" />
              <property name="testOnBorrow" value="true" />
          </bean>

          <!--shiro+redis缓存管理-->
          <bean class="redis.cache.RedisCacheManager" id="shiroRedisCacheManager">
              <property name="redisTemplate" ref="redisTemplate" />
          </bean>

          <bean class="redis.cache.RedisSessionDao" id="redisSessionDao">
              <property name="redisCacheManager" ref="shiroRedisCacheManager" />
              <property name="expireTime" value="70000" />
          </bean>
      ```


          <!--哨兵连接池-->
          <bean class="org.springframework.data.redis.connection.RedisSentinelConfiguration" id="sentinelConfiguration">
              <property name="master">
                  <bean class="org.springframework.data.redis.connection.RedisNode">
                      <property name="name" value="mymaster" />
                  </bean>
              </property>
              <property name="sentinels">
                  <set>
                      <bean class="org.springframework.data.redis.connection.RedisNode">
                          <constructor-arg name="host" value="${redis.host}" />
                          <constructor-arg name="port" value="${sentinel.port}" />
                      </bean>
                  </set>
              </property>
          </bean>
    
          <!--连接池工厂配置-->
          <bean class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" id="connectionFactory">
              <constructor-arg name="sentinelConfig" ref="sentinelConfiguration" />
              <!--<constructor-arg name="clusterConfig" ref="redisClusterConfiguration" />-->
              <constructor-arg name="poolConfig" ref="poolConfig" />
              <property name="hostName" value="${redis.host}" />
              <property name="port" value="${redis.port}" />
              <property name="timeout" value="${redis.timeout}" />
          </bean>


          <!-- 调用连接池工厂配置 -->
          <bean id="redisTemplate" class=" org.springframework.data.redis.core.RedisTemplate">
              <property name="connectionFactory" ref="connectionFactory" />
    
              <!-- 如果不配置Serializer，那么存储的时候智能使用String，如果用User类型存储，那么会提示错误User can't cast to String -->
              <property name="keySerializer">
                  <bean class="org.springframework.data.redis.serializer.StringRedisSerializer" />
              </property>
    
              <property name="valueSerializer">
                  <bean class="org.springframework.data.redis.serializer.JdkSerializationRedisSerializer" />
              </property>
    
              <property name="hashKeySerializer">
                  <bean class="org.springframework.data.redis.serializer.StringRedisSerializer" />
              </property>
    
              <property name="hashValueSerializer">
                  <bean class="org.springframework.data.redis.serializer.JdkSerializationRedisSerializer" />
              </property>
          </bean>
    
          <!--redis 缓存-->
          <bean class="Service.NewRedisCache" id="newRedisCache" />
          
          <bean class="redis.cache.ShiroCache" id="shiroCache">
              <property name="redisCache" ref="newRedisCache" />
          </bean>
              <!--<property name="jedisPool" ref="jedisPool" />-->
    
          <bean id="redisUtil" class="redis.util.RedisUtil">
              <property name="redisTemplate" ref="redisTemplate"/>
          </bean>
    
          <!-- 拦截器 -->
          <bean id="methodCacheInterceptor" class="redis.util.MethodCacheInterceptor">
              <property name="redisUtil" ref="redisUtil"/>
          </bean>
    
          <!--配置切面拦截方法 -->
          <aop:config proxy-target-class="true">
              <aop:pointcut id="aroundAdvice" expression="execution(* Service.*Impl.*(..))" />
              <aop:advisor advice-ref="methodCacheInterceptor" pointcut-ref="aroundAdvice" />
          </aop:config>
    
          <!--<bean class="redis.util.TestAdvice" />-->
          <!--<aop:aspectj-autoproxy proxy-target-class="true" />-->


      </beans>
      ```

redis.properties

​	

```yaml
#redis缓存配置
redis.host=127.0.0.1 
redis.port=6379  
redis.pass=0626  
redis.database=10  
redis.timeout=7000  

#redis连接池配置
#最多有多少个空闲实例
redis.maxIdle=300  
#一个pool可以配置多少个实例
redis.maxActive=600  
#最长的等待时间
redis.maxWait=6000  
#是否检查连接可用性
redis.testOnBorrow=true  

#jediscluster
cluster1.host=127.0.0.1
cluster1.port=6380
cluster2.host=127.0.0.1  
cluster2.port=6381

#sentinel
sentinel.port=26379
```

JedisSentinelUtils.java

- [ ] ```java
      package redis.util;

      import redis.clients.jedis.Jedis;
      import redis.clients.jedis.JedisPool;
      import redis.clients.jedis.JedisPoolConfig;
      import redis.clients.jedis.JedisSentinelPool;

      import java.util.HashSet;
      import java.util.Set;

      /**
       * @Author: FanYing
       * @Date: 2018-04-20 8:57
       * @Desciption:
       */
      public class JedisSentinelUtils {

          private static final String HOST = "127.0.0.1";

          private static int MAX_ACTIVE = 1024;

          private static int MAX_IDLE = 200;

          private static int MAX_WAIT = 10000;

          private static int TIMEOUT = 7000;

          private static boolean TEST_ON_BORROW = true;

          private final static JedisSentinelPool jedisSentinelPool;

          static {

              JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
              jedisPoolConfig.setMaxIdle(MAX_IDLE);
              jedisPoolConfig.setMaxWaitMillis(MAX_WAIT);
              jedisPoolConfig.setTestOnBorrow(TEST_ON_BORROW);

              Set<String> sentinels = new HashSet<>();

              sentinels.add(HOST+":26379");

              try {
                  jedisSentinelPool = new JedisSentinelPool("mymaster",sentinels,jedisPoolConfig);
              } catch (Exception e) {
                  e.printStackTrace();
                  System.out.println("jedis sentinel connect fail");
                  throw new RuntimeException();
              }

          }

          public synchronized static Jedis getSentinelJedis(){
              try{
                  if(jedisSentinelPool != null){
                      Jedis jedis = jedisSentinelPool.getResource();
                      return jedis;
                  }
              }catch (Exception e) {
                  e.printStackTrace();
                  return null;
              }
              return null;
          }

          public static void closeResource(final Jedis jedis){
              if(jedis != null){
                  jedis.close();
              }
          }

      }

      ```

RedisUtil.java

- [ ] ```java
      package redis.util;

      import org.apache.log4j.Logger;
      import org.springframework.data.redis.core.ListOperations;
      import org.springframework.data.redis.core.RedisTemplate;
      import org.springframework.data.redis.core.ValueOperations;
      import java.io.Serializable;
      import java.util.List;
      import java.util.Set;
      import java.util.concurrent.TimeUnit;

      /**
      * @Author: Fan
      * @Desciption: redis 工具类，由拦截器调用，进行缓存的读取和存入
      */

      public class RedisUtil {

          private static Logger logger = Logger.getLogger(RedisUtil.class);
          private RedisTemplate<Serializable, Object> redisTemplate;

          private ListOperations<Serializable,Object> listOperations;

          private ValueOperations<Serializable,Object> valueOperations;
          /**
           * 批量删除对应的value
           *
           * @param keys
           */
          public void remove(final String... keys) {
              for (String key : keys) {
                  logger.error("批量删除对应的value" + key);
                  remove(key);
              }
          }

          /**
           * 批量删除key
           *
           * @param pattern
           */
          public void removePattern(final String pattern) {
              Set<Serializable> keys = redisTemplate.keys(pattern);
              if (keys.size() > 0) {
                  logger.error("批量删除key" + keys);
                  redisTemplate.delete(keys);
              }
          }

          /**
           * 删除对应的value
           *
           * @param key
           */
          public void remove(final String key) {
              if (exists(key)) {
                  logger.error("删除对应的value" + key);
                  redisTemplate.delete(key);
              }
          }

          /**
           * 判断缓存中是否有对应的value
           *
           * @param key
           * @return
           */
          public boolean exists(final String key) {
              logger.error("断缓存中是否有对应的value" + redisTemplate.hasKey(key));
              return redisTemplate.hasKey(key);
          }

          /**
           * 读取普通缓存
           *
           * @param key
           * @return
           */
          public Object get(final String key) {
              Object result = null;
              try {
                  valueOperations = redisTemplate.opsForValue();
                  result = valueOperations.get(key);
                  logger.error("读取缓存" + result);
              } catch (Exception e) {
                  e.printStackTrace();
                  System.out.println("读取缓存异常：：message"+e.getMessage());
              }
              return result;
          }

          /**
           * 从缓存中获取list类型的数据
           * @param key
           * @param start
           * @param end
           * @return
           */
          public List<Object> getListValue(final  String key,int start, int end){

              List<Object> list = null;

              try {
                  listOperations = redisTemplate.opsForList();

                  list = listOperations.range(key,start,end);
              } catch (Exception e) {
                  e.printStackTrace();
              }

              return list;
          }

          public boolean setListValue(final String key, List<Object> values){

              boolean result = false;
              try {
                  logger.error("写入缓存key:" + key + " ----- value:" + values);
                  listOperations = redisTemplate.opsForList();

                  listOperations.rightPushAll(key,values);

                  result = true;
              } catch (Exception e) {
                  logger.error("系统异常", e);
              }

              return result;
          }
      ```


          /**
           * 写入缓存
           *
           * @param key
           * @param value
           * @return
           */
          public boolean set(final String key, Object value) {
              boolean result = false;
              try {
                  logger.error("写入缓存key:" + key + " ----- value:" + value);
                  valueOperations = redisTemplate.opsForValue();
                  valueOperations.set(key, value);
                  result = true;
              } catch (Exception e) {
                  logger.error("系统异常", e);
              }
              return result;
          }
    
          /**
           * 写入缓存
           *
           * @param key
           * @param value
           * @return
           */
          public boolean set(final String key, Object value, Long expireTime) {
              boolean result = false;
              try {
                  logger.error("写入缓存key:" + key + " ----- value:" + value + " ----- expireTime:" + expireTime);
                  ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
                  operations.set(key, value);
                  redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
                  result = true;
              } catch (Exception e) {
                  logger.error("系统异常", e);
              }
              return result;
          }
    
          public void setRedisTemplate(RedisTemplate<Serializable, Object> redisTemplate) {
              this.redisTemplate = redisTemplate;
          }
      }
    
      ```

SerizializUtils.java

- [ ] ```java
      package redis.util;

      import java.io.*;
      import java.util.ArrayList;
      import java.util.List;

      public class SerializeUtil {

          /**
           * 序列化
           * @param object
           * @return
           */
          public static byte[] serialize(Object object){

              ObjectOutputStream oos = null;
              ByteArrayOutputStream bos = null;
              byte[] byteArray = null;
              try {
                  bos = new ByteArrayOutputStream();
                  oos = new ObjectOutputStream(bos);

                  oos.writeObject(object);
                   byteArray = bos.toByteArray();

              } catch (IOException e) {
                  e.printStackTrace();
                  throw new RuntimeException("serialize is error!!!");
              }finally {

                  try{

                      if (bos != null){

                          bos.close();

                      }
                      if (oos != null){

                          oos.close();
                      }

                  }catch (Exception e){
                      throw new RuntimeException("close is ex");
                  }
              }
              return byteArray;
          }

          /**
           *  反序列化
           * @param arrayByte
           * @return
           */
          public static Object unSerialize(byte[] arrayByte){
              if (arrayByte == null){
                  System.out.println("arr is null.........................");
                  return  null;
              }

              ByteArrayInputStream bis = null;
              ObjectInputStream ois = null;

              try {
                  // 反序列化为对象
                  bis = new ByteArrayInputStream(arrayByte);
                  ois = new ObjectInputStream(bis);
                  return ois.readObject();

              } catch (Exception e) {
                  e.printStackTrace();

                  try {
                      if (bis != null){

                          bis.close();

                      }
                      if (ois != null){

                          ois.close();
                      }
                  } catch (IOException e1) {
                      e1.printStackTrace();
                  }
              }
              return null;
          }

          public  static  Object[] parseList(List<Object> dealList){
              Object[] target = new Object[dealList.size()];
              int i = 0;
              for (Object o : dealList) {

                  target[i++] = serialize(o);

              }
              return target;
          }
      ```


      }

      ```

