# GraphQL

## 定义：

用于API的查询语言，是基于使用类型系统来执行查询的服务端运行

一个GraphQL服务是通过定义类型和类型上的字段来创建的然后给每个类型上的每个字段提供解析函数

## 查询语句基本概念

### Fields(字段)

GraphQL 是关于请求对象上的特定字段，查询和其结果的结构是几乎一样的，同时返回的结果字段可以直接是一个字符串，也可以是对象

```json
查询英雄的名字：
{
 	 hero {
    		name
 		 }
}
结果：
{
 	 "data": {
    			"hero": {
     				 "name": "R2-D2"
    					}
 			 }
}

查询英雄和其朋友名字
{
  hero{
    name
    #查询可以允许有备注
    friends{
      name
    }
  }
}

{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}

#GraphQL 查询能够遍历相关对象及其字段，使得客户端可以一次请求查询大量相关数据，而不像传统 REST 架构中那样需要多次往返查询。
```



###参数（Arguments） 

```json
在查询中我们可以指定查询的条件
查询human的编号为1000的姓名和身高
{
  human(id:1000){
    name
   	height
  }
}
结果如下：
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}

```



###  别名（Aliases）

如上例子，如果查询的相同字段有多个参数，那么不设置别名，即使返回参数也不能具体识别，所以必须设置别名，让服务器识别

```js
需求：分别查询episode为 EMPIRE或jedi的名字
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}

{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}

```



### 片段（Fragments）

适用于复杂查询，也就是查询的条件很多，但是需要的字段存在重复的部分，那么就可以将其进行封装，就像调用方法、对象那样直接获取就行

```json
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

## ...是引用片段的语法 

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}


```



### 操作名称（Operation name）

在此之前我们每一个查询都不规范，少了操作名称（也就是告诉服务器这个语句用来干嘛，增删改查？），其次语句名称也没定义，这样不利于后期的维护

操作名称分为：*query*、*mutation* 或 *subscription*

```json
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}


{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

### 变量（Variables）

在进行查询时经常会传入动态的参数，在此之前都是动态的查询变量

变量应用三步走：

​	使用$VariableName代替动态的变量

​	声明$VariableName为查询的接受的变量之一

​	将`variableName: value` 通过传输专用（通常是 JSON）的分离的变量字典中。

```json
# { "graphiql": true, "variables": { "episode": JEDI } }
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```



​	