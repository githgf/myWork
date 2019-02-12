# MessageQueue(消息队列)

## 应用场景

### 异步处理

应用场景：

​	当消费者需要的服务不需要很快得到结果时，比如说用户的登录注册，当用户注册后不需要非常快的接受到注册成功的信息和邮件，只想能登录相关的界面那么，可以将注册成功的信息和其他操作放在消息队列中，用户注册成功登录界面，服务器发送异步请求消息队列将所需要的其他服务从消息队列中拿出来进行相应的操作

![应用解耦](image\应用解耦.png)



### 应用解耦

应用场景：

​	当消费者下订单之后，那么会调用库存相应的接口，实现库存的减少，以前是直接调用，有了消息队列之后可以在订单系统和库存系统之间放一个消息中间件，通过订阅和发布机制进行业务的处理

![应用解耦](image\应用解耦.png)



### 流量削峰

应用场景：

​	![流量削峰](image\流量削峰.png)

## JMS 和 AMQP

JMS :java message server(java消息服务)

AMQP: Advence Message Queue Protocol

![jsm_amop](image\jsm_amop.png)



## RabbitMQ

RabbitMQ是一个由erlang开发的AMQP(Advanved Message Queue Protocol)的开源实现。

### 组成部分



![消息中间件的组成](image\消息中间件的组成.png)

#### Message

​	消息的主体部分，它由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。

#### Publisher

​	消息的生产者，也是一个向交换器发布消息的客户端应用程序。

#### Exchange

​	交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。

​	Exchange有4种类型：direct(默认)，fanout, topic, 和headers

#### Queue

​	队列，存放消息的容器，也是消息终点，在容器中的消息将会被来队列请求的请求所处理

#### Binding

​	绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。

Exchange 和Queue的绑定可以是多对多的关系。

**换言之没有设置绑定，就算路由键匹配消息发送也是失败**

#### Connection

​	一个网络连接，tcp

#### Channel

​	信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内的虚拟连接，AMQP 命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接

#### Consumer

消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。

#### Virtual Host

虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。

#### Broker

表示消息队列服务器实体

### 运行机制

#### AMQP 中的消息路由

​	消息由生产者发布到交换器中，而由绑定来决定交换器的消息放在什么样的消息队列中

![amop消息路由](image\amop消息路由.png)

#### Exchange类型

​	**交换器相当于路由器，根据路由键将消息发送到消息队列**

​	direct、fanout、topic、headers 。headers 匹配 AMQP 消息的 header 而不是路由键， headers 交换器和 direct 交换器完全一致，但性能差很多，目前几乎用不到了

##### Direct：

​	点对点单播的方式

​	![direct](image\direct.png)

##### Fanout

​	将消息广播到每个消息队列fanout 交换器不处理路由键，只是简单的将队列绑定到交换器上，每个发送到交换器的消息都会被转发到与该交换器绑定的所有队列上。很像子网广播，每台子网内的主机都获得了一份复制的消息。**fanout 类型转发消息是最快的**

![fanout_exchange](image\fanout_exchange.png)

比如说有一个消息路由键是

##### Topic

​	topic 交换器通过模式匹配分配消息的路由键属性，将路由键和某个模式进行匹配，此时队列需要绑定到一个模式上。它将路由键和绑定键的字符串切分成单词，这些单词之间用点隔开。它同样也会识别两个通配符：符号“#”和符号“*”。#匹配0个或多个单词，*匹配一个单词。**topic复杂度较高**

![topic_exchange](image\topic_exchange.png)



### 安装

在centons 7 用docker安装

```java
1.安装镜像
	docker pull registry.docker-cn.com/library/rabbitmq:3-management(带有管理界面的rabbitmq)
2.查看安装的镜像id
	docker images
3.启动镜像(因为这是带管理界面的版本所以有两个端口)
	docker run -d -p 5672:5672 -p 15672:15672 --name myrabbitmq c51d1c73d028
4.访问
	虚拟机ip:端口号
	118.25.194.36:15672
```



### 测试

现在有应用场景是

​	三个交换器：direct、topic、fanout

​	四个消息队列：hgf、hgf.test、hgf.example、test.example

​	绑定情况如下：

direct

​		     					![direct_bind](image\direct_bind.png)

fanout

![fanout_bind](image\fanout_bind.png)

topic

​							![topic_bind](image\topic_bind.png)

现在direct发送消息路由键为hgf各个消息队列的情况如下

![direct_message_test](image\direct_message_test.png)

现在fanout发送消息路由键为hgf各个消息队列的情况如下（存在上个结果残留）

![fanout_mess_test](image\fanout_mess_test.png)

现在topic发送消息路由键为*.hgf各个消息队列的情况如下

![topic_message_test](image\topic_message_test.png)

### spring boot整合

#### 导入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java

@Before
	public void setup(){
		messageMap = new HashMap<>();
		messageMap.put("data", Arrays.asList("test direct",123,true));
		messageMap.put("msg","direct message");
	}

	@Test
	public void sendDirectTest() {
		//交换器的名字
		exchangeString = "exchange.direct";
		//路由键
		routKey = "hgf";

		//将消息序列化之后发送出去
		rabbitTemplate.convertAndSend(exchangeString,routKey,messageMap);

	}

	@Test
	public void sendFanoutTest(){

		exchangeString = "exchange.fanout";
		routKey = "";

		rabbitTemplate.convertAndSend(exchangeString,routKey,messageMap);

	}

	@Test
	public void sendTopicTest(){

		exchangeString = "exchange.topic";

		routKey = "hgf.#";

		rabbitTemplate.convertAndSend(exchangeString,routKey,messageMap);


	}

	@Test
	public void receive(){

		//将消息接收后实现反序列化
		Object hgf = rabbitTemplate.receiveAndConvert("hgf");
		System.out.println(hgf.toString());

	}
```

#### 监听器

​	

```java
在启动类中加入@EnableRabbit

@RabbitListener(queues = {"hgf"})
    public void listen(Message message){
        System.out.println("hgf队列接受到消息");
        System.out.println("message body"+ message.getBody());

        System.out.println("message head"+ message.getMessageProperties());
    }
```

#### AmqpAdmin

创建消息中间件组件

```java
//创建队列
		amqpAdmin.declareQueue(new Queue("admin.test",true));
		//创建交换器
		amqpAdmin.declareExchange(new DirectExchange("admin.exchange"));
		//创建绑定
		amqpAdmin.declareBinding(new Binding(
                  "admin.test",//DestinationType类型的名（这里是队列）
                  Binding.DestinationType.QUEUE,//DestinationType类型
                  "admin.exchange",//交换器
                  "hgf",//路由键
                  null)//参数
                                );

```
[选择kafka还是rabbitmq](https://content.pivotal.io/rabbitmq/understanding-when-to-use-rabbitmq-or-apache-kafka)