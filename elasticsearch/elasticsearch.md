# Elasticsearch



```xml
1.安装镜像
docker pull registry.docker-cn.comlibraryelasticsearch
2.运行镜像（默认运行2g，限制如下）
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx260m" -d -p 9200:9200 -p 9300:9300 --name ES01 671bb2d7da44
```

## 官网定义：

Elasticsearch 是一个分布式的 RESTful 风格的搜索和数据分析引擎

- 一个分布式的实时文档存储，*每个字段* 可以被索引与搜索
- 一个分布式实时分析搜索引擎
- 能胜任上百个服务节点的扩展，并支持 PB 级别的结构化或者非结构化数据

## 相关概念：

​
ElasticSearch 集群可以 包含多个 索引 ，相应的每个索引可以包含多个 类型 。 这些不同的类型存储着多个 文档 ，每个文档又有 多个 属性 。

​

| mysql | ElasticSearch |
| ----- | :-----------: |
| 数据库   |      索引       |
| 表     |      类型       |
| 行数据   |      文档       |
| 列数据   |      属性       |
|       |               |

## crud

### 增加：

```json
PUT ip:端口/megacorp/employee/1
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
megacorp：索引
employee：类型
1 ： id（相当于主键）

之后回应的json为
{
    "_index": "megacorp",
    "_type": "employee",
    "_id": "1",
    "_version": 1,//增加信息版本为1
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "created": true
}

```

### 查询



#### 简单查询

查询id为1的员工

- [ ] ```json
      GET /megacorp/employee/1
      ```

查询所有记录

- [ ]   ```json
       GET /megacorp/employee/_search
        ```

搜索姓氏为 ``Smith`` 的雇员

- [ ] ```json
      1.方式一
      GET /megacorp/employee/_search?q=last_name:Smith


      方式二
      POST /megacorp/employee/_search
      发送的条件
      {
          "query" : {
              "match" : {
                  "last_name" : "Smith"
              }
          }
      }
      ```

#### 高级查询

查询形式为smith，年龄在10-25

```json
POST /megacorp/employee/_search
{
    "query" : {
        "bool": {
            "must": {
                "match" : {
                    "last_name" : "smith" 
                }
            },
            "filter": {
                "range" : {
                    "age" : { "gt" : 10, "lt" : 25 } 
                }
            }
        }
    }
}
```

#### 全文查询

搜索下所有喜欢攀岩（rock climbing）的雇员：



- [ ] ```json
      GET /megacorp/employee/_search

      {
          "query" : {
              "match" : {
                  "about" : "rock climbing"
              }
          }
      }

      会得到多个结果，但是会在结果集中进行相应的关键字段排序

      {
          "took": 8,
          "timed_out": false,
          "_shards": {
              "total": 5,
              "successful": 5,
              "skipped": 0,
              "failed": 0
          },
          "hits": {
              "total": 2,
              "max_score": 0.53484553,
              "hits": [
                  {
                      "_index": "megacorp",
                      "_type": "employee",
                      "_id": "1",
                      "_score": 0.53484553,
                      "_source": {
                          "first_name": "John",
                          "last_name": "Smith",
                          "age": 25,
                          "about": "I love to go rock climbing",
                          "interests": [
                              "sports",
                              "music"
                          ]
                      }
                  },
                  {
                      "_index": "megacorp",
                      "_type": "employee",
                      "_id": "2",
                      "_score": 0.26742277,
                      "_source": {
                          "first_name": "Jane",
                          "last_name": "Smith",
                          "age": 32,
                          "about": "I like to collect rock albums",
                          "interests": [
                              "music"
                          ]
                      }
                  }
              ]
          }
      }
      ```

#### 短语搜索

仅匹配同时包含 “rock” *和* “climbing” ，*并且* 二者以短语 “rock climbing” 的形式紧挨着的雇员记录。

- [ ] ```json
      GET /megacorp/employee/_search
      {
          "query" : {
              "match_phrase" : {
                  "about" : "rock climbing"
              }
          }
      }
      ```



#### 高亮搜索

会在查询结果的执行属性加上高亮的处理

- [ ] ```json
      GET /megacorp/employee/_search
      {
          "query" : {
              "match_phrase" : {
                  "about" : "rock climbing"
              }
          },
          "highlight": {
              "fields" : {
                  "about" : {}
              }
          }
      }
      ```

#### 分析

挖掘出雇员中最受欢迎的兴趣爱好

- [ ] ```json
      GET /megacorp/employee/_search
      {
        "aggs": {
          "all_interests": {
            "terms": { "field": "interests" }
          }
        }
      }

      有点类似于mysql中的group by函数
      ```

### 删除

#### 简单删除

删除二号员工

```
DELETE /megacorp/employee/2
```

#### 删除所有

```
POST /megacorp/employee/_delete_by_query
{
    "query": {
        "match_all": {}
    }
}
```



#### 条件删除

```json
POST /megacorp/employee/_delete_by_query

{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
```

### 修改

```json
POST /megacorp/employee/1/_update
//doc必须的
{
    "doc" : {
     "last_name" : "test update"
   }
}
```

## spring boot整合

### jest

导入依赖

```xml
<!-- https://mvnrepository.com/artifact/io.searchbox/jest -->
<dependency>
    <groupId>io.searchbox</groupId>
    <artifactId>jest</artifactId>
    <version>5.3.2</version>
</dependency>

```

创建索引

```java
@Autowired
	JestClient jestClient;

	@Test
	public void createIndex() {

		Employee employee = new Employee("jack","play basketball",15);

		Index build = new Index.Builder(employee)
				               .index("megacorp")
				               .id("2")
				               .type("employee")
				               .build();

		try {
			jestClient.execute(build);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
```

查询

```java
@Test
	public void search(){

		String searchJson = "{\n" +
				"    \"query\" : {\n" +
				"        \"match\" : {\n" +
				"            \"first_name\" : \"John\"\n" +
				"        }\n" +
				"    }\n" +
				"}";

		Search build = new Search
								.Builder(searchJson)
								.addIndex("megacorp")
								.addType("employee")
								.build();


		try {
			SearchResult execute = jestClient.execute(build);

			System.out.println(execute.getJsonString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
```

删除

```java
@Test
	public void delete(){

		Delete build = new Delete
								.Builder("2")
								.index("megacorp")
								.type("employee")
								.build();

		try {
			jestClient.execute(build);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
```

### spring data elastic search

在进行整合是注意版本的控制

![搜狗截图20180528110739](D:\java lib\elasticsearch\images\搜狗截图20180528110739.png)

