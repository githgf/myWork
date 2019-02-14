# MongDB

# 概览

## 是什么

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。





# 安装：	

### docker 安装

​	准备工作：开放27017端口

```shell
1.dokcer 拉镜像
	docker pull mongo
2.启动镜像
	docker run 
	--name mongodb-4.0
    -v /data/mongodb/db:/data/db 
    -p 27017:27017
    -d [镜像id]
    --auth
 3.进入容器并且配置
 	docker exec -it mongodb-4.0 mongo admin
 4.配置用户名、密码
 	db.createUser({
      user : "root",
      pwd  : "mongodb",
      roles : [{role : "root","db" : "admin"}] 
 	});
 	-详情可见mongodb 用户权限

```



## MongoDB用户权限

### 内建的角色

1. 数据库用户角色：read、readWrite;

2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；

3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；

4. 备份恢复角色：backup、restore；

5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase

6. 超级用户角色：root // 这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner 、userAdmin、userAdminAnyDatabase）

7. 内部角色：__system

   ### 具体说明：

   **Read**：允许用户读取指定数据库

   **readWrite**：允许用户读写指定数据库

   **dbAdmin**：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile

   **userAdmin**：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户

   **clusterAdmin**：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。

   **readAnyDatabase**：只在admin数据库中可用，赋予用户所有数据库的读权限

   **readWriteAnyDatabase**：只在admin数据库中可用，赋予用户所有数据库的读写权限

   **userAdminAnyDatabase**：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限

   **dbAdminAnyDatabase**：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。

   **root**：只在admin数据库中可用。超级账号，超级权限

   ​

## 设置为系统服务

1.在server同级目录创建data文件夹

2.在data文件中创建db、log俩个文件夹

3.在log文件中创建mongod.log文件

4.在mongodb目录下的bin创建同级的文件mongod.cfg

​	写入

```
systemLog:
   destination: file
   path: D:\nosql\mongdb\data\log\mongod.log
storage:
   dbPath: D:\nosql\mongdb\data\db
```

5.cmd以管理员方式运行

```xml
sc.exe create MongoDB binPath= "\"D:\nosql\mongdb\Server\3.4\bin\mongod.exe\" --service --config=\"D:\nosql\mongdb\Server\3.4\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"
```

## 基本概念

数据库：数据集合的容器（和mysql数据库差不多）

集合：数据文档的存放体（类似于数据表）

文档：数据实体（类似于数据表的行数据）



## 基本操作

| use database                       | 进入相应的数据库，如果没有则自动创建 |
| ---------------------------------- | -----------------: |
| db                                 |         表示当前所处的数据库 |
| show collections                   |      显示数据库中所有的数据表格 |
| db.<collections>.insert(bson);     |   向集合中插入数据（id自动创建） |
| db.<collection>.find();            |         查找集合中的所有数据 |
| db.<collections>.insertOne(bson);  |           插入一个数据对象 |
| db.<collections>.insertMany(bson); |           插入多个数据对象 |
| db.<collection>.find(bson);        |        查询符合条件的文档数据 |
| db.<collection>.findOne(bson);     |     查询符合条件集合的第一个数据 |
|                                    |                    |
|                                    |                    |
|                                    |                    |
| 查询表达式                              |                    |

| $eq  | =    |
| ---- | ---- |
| $lt  | <    |
| $lte | <=   |
| $gt  | >    |
| $gte | >=   |
| $in  | 包含   |
| $nin | 不包含  |
| $ne  | ！=   |
|      |      |
|      |      |

```json
/*
    查询num大于500
*/
db.teach.find(
    {
        name:{$gt:500}
    }
);
/*
	查询符合条件前2条记录
*/
db.teach.find({
    name:"hello"
    }).limit(2);
/*
	查询符合条件的11-20数据
	skip是跳过几条
*/
db.teach.find().skip(10).limit(10);

/**
	多条件查询
*/
db.ExpressTrajectoryLog.find({ 
  $and : [
  	{"createTime" : {$lte : ISODate("2018-06-30T18:00:00.000+0000")}},
  	{"createTime" : {$gte : ISODate("2018-06-11T18:00:00.000+0000")}},
  	{ $or :
   	    [ 
   	    	{ "trajectoryStatus" : "ETP01"} , 
   	    	{ "trajectoryStatus" : "ETP010"} , 
   	    	{ "trajectoryStatus" : { "$regex" : "^ESE"}}
   	    ]
   	  }
  ]
}).sort({
    "createTime": 1,
    "creatorId": 1
});

```

内嵌文档查询

```java
内嵌文档查询主要是对数组的元素进行筛选
网站：https://blog.csdn.net/drifterj/article/details/7833883
```



修改

```json
/*
    
    修改
        $set修改指定属性
        $unset删除指定的属性
    update 默认只能修改符合查询条件的其中之一的文档对象
    updateOne 只能修改一个
    updateMany 同时修改多个
*/
db.teach.update(
    {name:"hello"},
    {
    $set:{age:15}
    }
);

db.teach.updateOne(
    {name:"hello"},
    {
    $unset:{age:15}
    }
);

db.teach.updateMany(
    {name:"hello"},
    {
    $unset:{age:15}
    }
);
```

删除

```
--删除所有
db.teach.remove({})；



```

## 文档之间的关系

一对多、多对一

```json
db.user.insert(
[
    {
        name:"user1"
    },
    {
        name:"user2"
    } 
 ]   
);

db.order.insert(
 [
    {
        list:["or1","or2"],
        user:ObjectId("5b0e14177edb099ce17a3d97")
    },
    {
        list:["or3","or4"],
        user:ObjectId("5b0e14177edb099ce17a3d98")
    }
 ]
);
```

一对一

多对多

```json
db.user.insert(
[
    {
        name:"user1"
    },
    {
        name:"user2"
    } 
 ]   
);

db.order.insert(
 [
    {
        list:["or1","or2"],
        user:[
        	ObjectId("5b0e14177edb099ce17a3d97"),
        	ObjectId("5b0e14177edb099ce17a3d98")
        	]
    },
    {
        list:["or3","or4"],
        user:[
        	ObjectId("5b0e14177edb099ce17a3d98"),
        	ObjectId("5b0e14177edb099ce17a3d97")
        	]
    }
 ]
);
```

## sort和投影



```
sort根据指定的字段排序， 1 -升序  -1 -降序
db.teach.find({}).sort({age:1})

投影：显示自己想要的字段
db.teach.find({},{name:1})

```

## aggregate

| 操作符      |                           对应的含义 |
| :------- | ------------------------------: |
| $project |            数据投影，主要用于重命名、增加和删除字段 |
| $match   |          用于查询，相当于find，用法和find一样 |
| $group   |               将集合中的文档分组，可用于统计结果 |
| $sort    |                              排序 |
| $limit   |                 相当于mysql中的limit |
| $skip    |                            跳过几行 |
| $unwind  | 将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值 |
|          |                                 |
|          |                                 |

```js
需求：查询出每天每人送货数量

db.order.aggregate(
[
	{
	
		"$match":{
					"inDate":{"$lte":"2018-05-31","$gte":"2018-05-28"}
				}
	},

	{
		"$group":{
		  			"_id":{"userId":"$userId","inDate":"$inDate"},
		  			"count":{$sum:1}
		  		}
	},
	{
		"$sort":{
					"_id.userId":1
				}
	},
	{
		"$project":{
					"_id":0,
					"userId":"$_id.userId",
					"inDate":"$_id.inDate",
					"count":1
				}
	}
]
)
```



## group

| 操作符       |                                    对应的含义 |
| --------- | ---------------------------------------: |
| key       |                                    排序的字段 |
| inital    |                           每个文档都分享这个初始化函数 |
| reduce    | 这个函数的第一个参数是当前的文档对象，第二个参数是上一次function操作的累计对象。有多少个文档， $reduce就会调用多少次 |
| condition |                                     过滤函数 |
| finalize  |                            在整体执行完之后进行的方法 |
|           |                                          |

```js
db.order.group(
{
	key:{"name":1,"inDate":1,"userId":1},
	initial:{"count":0},
	reduce:function(doc,out){out.count++;},
	condition:{"inDate":{"$gte":"2018-05-12","$lte":"2018-05-31"}},
	finalize:function(out){return out;}
}	
);
```



将结果集导出为excel



## 集群配置

### Master-Slave主从结构

![img](http://images2015.cnblogs.com/blog/524341/201609/524341-20160929154816719-1305080465.png)

和redis主从复制相类似，主库中的操作会通过oplog(操作日志)文件的方式，将数据同步到从库中

但是mongodb 官方并不推荐此结构，原因如下：

​	1.从库不支持链式结构，也就是不能在从库下再次添加从库

​	2.当主库挂机之后，从库不能自动成为主库

### Relica Set副本集方式

Mongodb的Replica Set即副本集方式主要有两个目的，

​	一个是数据冗余做故障恢复使用，当发生硬件故障或者其它原因造成的宕机时，可以使用副本进行恢复。

​	另一个是做读写分离，读的请求分流到副本上，减轻主（Primary）的读压力。

#### 三类角色

##### **主节点（Primary）**

接收所有的写请求，然后把修改同步到所有Secondary。一个Replica Set只能有一个Primary节点，当Primary挂掉后，其他Secondary或者Arbiter节点会重新选举出来一个主节点。

##### **副本节点（Secondary）**

与主节点保持同样的数据集。当主节点挂掉的时候，参与选主。

##### **仲裁者（Arbiter）**

不保村数据，不参与选主（主节点候选），只进行选主投票。使用Arbiter可以减轻数据存储的硬件需求，Arbiter跑起来几乎没什么大的硬件资源需求，但重要的一点是，在生产环境下它和其他数据节点不要部署在同一台机器上。

注意，一个自动failover的Replica Set节点数必须为奇数，目的是选主投票的时候要有一个大多数才能进行选主决策。

#### 选主机制：	

![æ°ä¸»è¦éä¸¾çå¾ã å¨å·æä¸¤ä¸ªè¾å©å¯æ¬çä¸ä¸ªæåå¯æ¬éä¸­ï¼ä¸»è¦åå¾æ æ³è®¿é®ã å¤±å»ä¸ä¸ªä¸»è¦è§¦åéä¸¾ï¼å¶ä¸­ä¸ä¸ªè¾å©æä¸ºæ°çä¸»è¦](https://docs.mongodb.com/manual/_images/replica-set-trigger-election.bakedsvg.svg)

当主机挂掉时，会在副本集合中重新通过[选举的方式](https://docs.mongodb.com/manual/core/replica-set-elections/) 推举出一个新的主节点，在选举成功完成之前，副本集无法处理写入操作，如果此类查询配置为[在辅助节点上运行，](https://docs.mongodb.com/manual/core/read-preference/#replica-set-read-preference)则副本集可以继续提供读取查询 fih

根据测试当主库在修复之后回到副本集中，并不会成为主节点



故障转移过程通常在一分钟内完成。副本集中的其他节点可能需要10到30秒来让确认主节点不可访问。在确认后将发起选举。选举的过程可能需要10到30秒。

#### docker普通方式 副本集群配置

```shell
#首先需要keyfile,作用就是类似于私钥
mkdir -p /data/mongodb0_conf
cd /data/mongodb0_conf
openssl rand -base64 741 > mongodb-keyfile
chmod 600 mongodb-keyfile
chown 999 mongodb_keyfile

#依次启动三个docker镜像
docker run --name monngodb0 \
--restart always \
-v /data/db/mongodb0:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27017:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth


docker run --name monngodb1 \
--restart always \		#放到后面会报错
-v /data/db/mongodb1:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27018:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth

docker run --name monngodb2 \
--restart always \
-v /data/db/mongodb2:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27019:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth

#进入到其中一个你希望设置为primary的容器
docker exec -it 76a9a8f7446b mongo admin

#构建集群（直接复制，不要乱加“”，否则报错  语法错误）
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "106.12.35.133:27017" },
      { _id: 1, host: "106.12.35.133:27018" },
      { _id: 2, host: "106.12.35.133:27019" }
   ]
});
#查看是否为主(一定要执行,当显示  rs0:PRIMARY>  就行)
rs.isMaster();

#切换到其他副本，执行以下操作
rs.slaveOk();				#如果在副本集中出现"not master and slaveOk=false，这句话必须设置
use admin
db.getMongo().setSlaveOk()
db.setSlaveOk()

#回到主节点，增加用户（创建用户只能在primary节点进行，否则报错 not master）
db.createUser({
 user : "root",
 pwd : "mongodb",
 roles : [{role: "root", db: "admin"}]
});

#退出重新登录即可

#mongodb docker 用户名密登录
#方式一（暂时就这个方案可行）
docker exec -it 76a9a8f7446b mongo admin
use admin  	#如果没有指定登陆的 数据库为admin ，此处不可省略，否则报错
db.auth("root","mongodb");


```

[副本集成员配置](https://docs.mongodb.com/manual/administration/replica-set-member-configuration/)

根据测试貌似选举时会倾向于曾经是主节点的副本节点

副本集（参加选举投票的节点最好是奇数）

可以通过以下方式强制成为主节点

1.设置一个副本节点的优先级为最高

```js
cfg = rs.conf()
cfg.members[0].priority = 0.5
cfg.members[1].priority = 0.5
cfg.members[2].priority = 1
rs.reconfig(cfg)
```

2.强制将其他节点冻结

```js
rs.freeze(100000)
```

### [sharding 分片集群](https://docs.mongodb.com/manual/sharding/)

前言：

​	现在数据库拓展方案主要有以下两种：垂直扩展和水平扩展。

垂直扩展包括增加单个服务器的能力，比如使用更强的CPU，添加更多内存，或者增加存储空间。现有技术的局限可能让单台机器无法应对某个给定的工作负载。另外，云服务商能够提供的硬件配置也有一定的上限。因此在实践中，垂直扩展能够应对的负载有上限。

水平扩展包括数据集的划分，和多台服务器分摊负载，水平扩展可以通过添加新的机器来提升处理能力。虽然单机的能力可能不是很强，但是每台机器都负责处理整体负载的一个子集，因此有能力提供比高速大容量服务器更高的效率。水平扩展提升系统的处理能力只需要添加新的服务器，这比提升高端服务器性能所需的成本要低。缺点是增加了基础设施部署和维护的复杂度

**分片集群采用就是水平扩展的方式**

和副本集群不同的是，分片集群没有主节点，读写都是一样的权限，

![Diagram of a sample sharded cluster for production purposes.  Contains exactly 3 config servers, 2 or more ``mongos`` query routers, and at least 2 shards. The shards are replica sets.](https://docs.mongodb.com/manual/_images/sharded-cluster-production-architecture.bakedsvg.svg)



#### 组件

##### 	shard：

​	每个shard都包含数据分片的一个子集。每个shard都可以部署为一个副本集

##### mongos：

​	mongos作为查询路由，提供客户端应用程序和分片集群之间的接口

##### config servers：

​	config servers存储集群中的元数据和配置数据。在Mongo 3.4以后，config server必须被部署为副本集



************************************************************************

shard key：

​	通俗点讲就是分片的根据

​	MongoDB使用shard key对collection的数据分片。shard key由一个不可变的字段或目标collection中每个文档都存在的字段组成。

需要在对collection分片的时候选择shard key。shard key之后不能更改。一个分片的collection只能有一个shard key。

chunks

​	MongoDB将数据分片到chunk中。依据选择的shard key，每个chunk大小都有下限和上限。

​	在集群中，MongoDB使用分片集群均衡器迁移各个chunk。均衡器试图实现在集群中chunk的均衡。



#### 优势

​	1.读写性能：

​		如果查询的关键字包含了shard key，直接定位到指定的分片

​		MongoDB的分布在整个的读写工作量 [碎片](https://docs.mongodb.com/manual/reference/glossary/#term-shard)将在[分片集群](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)，使每个碎片来处理群集操作的一个子集。通过添加更多分片，可以在群集中水平扩展读取和写入工作负载。

​		对于包含分片键或[复合分片](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index)键前缀[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)的查询，可以在特定分片或分片集上定位查询。这些[目标操作](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/#sharding-mongos-targeted)通常比向群集中的每个分片[广播](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/#sharding-mongos-broadcast)更有效 。

​	2.存储容量

​		[拆分](https://docs.mongodb.com/manual/reference/glossary/#term-sharding)分配整个数据[碎片](https://docs.mongodb.com/manual/reference/glossary/#term-shard)集群中，允许每个碎片以包含总簇数据的子集。随着数据集的增长，额外的分片会增加群集的存储容量。

​	3.高可用

​		从MongoDB 3.2开始，您可以将[配置服务器](https://docs.mongodb.com/manual/reference/glossary/#term-config-server)部署为[副本集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)。只要大多数副本集可用，具有配置服务器副本集（CSRS）的分片群集就可以继续处理读取和写入。

#### 分片前的注意事项

​	分片集群基础架构要求和复杂性需要仔细规划，执行和维护。

​	选择分片密钥时需要认真考虑，以确保集群性能和效率。分片后不能更改分片键，也不能取消分片分片。请参阅 [选择分片键](https://docs.mongodb.com/manual/core/sharding-shard-key/#sharding-internals-operations-and-reliability)。

​	Sharding具有一定的[操作要求和限制](https://docs.mongodb.com/manual/core/sharded-cluster-requirements/#sharding-operational-restrictions)。有关详细信息，请参阅 [分片群集中的操作限制](https://docs.mongodb.com/manual/core/sharded-cluster-requirements/)。

​	如果查询*不*包括分片键或[复合分片](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index)键的前缀 ，则[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)执行[广播操作](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/#sharding-mongos-broadcast)，查询分 片群集中的*所有分*片。这些分散/收集查询可以是长时间运行的操作。

# 注意点：

1. mongodb存储数据时，都是存放0时区的时间

   在插入时如果是程序会自动转换，如果是数据库直接插入，需要指定时区，

   在查询时如果是程序会自动转换，如果是直接数据库查询，需要指定时区