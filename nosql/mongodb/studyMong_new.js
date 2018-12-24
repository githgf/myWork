/*
	mongodb数据库备份
		备份指定数据库
		mongodump -h 127.0.0.1 -d study -o D:\nosql\mongdb\Server\4.0\testBackup
		-h			ip
		-d			dbName
		-o			备份数据存储的位置（必须先存在）
		
		备份所有数据
		mongodump --host HOST_NAME --port PORT_NUMBER
		
		备份指定数据库集合
		mongodump --collection COLLECTION --db DB_NAME
		
	恢复：
		
		>mongorestore -h <hostname><:port> -d dbname <path>
		--host <:port>, -h <:port>：						MongoDB所在服务器地址，默认为： localhost:27017
		--db , -d ：										需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2
		--drop：											恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用哦！
		<path>：											mongorestore 最后的一个参数，设置备份数据所在位置，例如：c:\data\dump\test。
				你不能同时指定 <path> 和 --dir 选项，--dir也可以设置备份目录。
		--dir：											指定备份的目录
				你不能同时指定 <path> 和 --dir 选项。
	
	mongostat 命令（监控）
		mongostat是mongodb自带的状态检测工具，在命令行下使用。它会间隔固定时间获取mongodb的当前运行状态，并输出。
		如果你发现数据库突然变慢或者有其他问题的话，你第一手的操作就考虑采用mongostat来查看mongo的状态。
		
*/


/**
  * $expr 可以用来比较同一个文档的不同字段 【 3.6+】
  *
  */
db.ExpressTimeLog.find({
  //查询所有lostOwnerName和deliveredUserName两个属性相同的
	$expr : {
		$eq : ["$lostOwnerName","$deliveredUserName"]
	}
});
// 可以配合$cond进行复杂的查询
db.ExpressTimeLog.find({
  //查询所有deliveredNum这个属性小于等于5，除以1，否则除以2，之后小于5的
	$expr : {
		$lt : [{
			$cond : {
				if : {$gte : ["$deliveredNum",5]},
				then : {$divide : ["$deliveredNum",1]},
				else : {$divide: ["$deliveredNum", 2]}
			}
		},5]
	}
});

/*
 *$jsonSchema [3.6+]
 	学完$type之后再学
 */
 
---------------------------------------------
---------------------------------------------

/**
 *	$mod  [2.6更新]
 *	 
 	$mod : [3,2]
 *		取模操作,也就是符合被操作的属性被3整除之后，还余2的所有文档
 */
db.ExpressTimeLog.find({
	"deliveredNum" : {$mod : [2,0]}
});

---------------------------------------------
---------------------------------------------

/*
	$regex 
	相当于正则表达式：
 *	{<field>:{$regex:/pattern/，$options:’<options>’}}
	{<field>:{$regex:’pattern’，$options:’<options>’}}
	{<field>:{$regex:/pattern/<options>}}
 *	也可以写成正则表达式对象：
 	{<field>: /pattern/<options>}
 	
 	options有以下几种
 		i			代表不区分大小写
 		m			代表多行匹配，主要用来匹配有换行符\n的情景
 		s			允许点字符（.）匹配所有的字符，包括换行符(使用此操作符必须要$options)
 		x			忽视空白字符(使用此操作符必须要$options)
 	
 */

db.ExpressTimeLog.find({
	"storeNo" : {$regex : /01/,$options : "i"}
});
//storeNo包含hz的，忽略大小写
db.ExpressTimeLog.find({
	"storeNo" : {$regex : /hz/i}
});
//storeNo以HU开头的,包含\n字符
db.ExpressTimeLog.find({
	"storeNo" : {$regex : /^HU/,$options : "m"}
});
//storeNo以h开头，以2结尾，忽略大小写，单行匹配
db.ExpressTimeLog.find({
	"storeNo" : {$regex : /^h.*2/,$options : "si"}
});


/*
	$text [3.2+]		全文检索
{
  $text:
    {
      $search: <string>,
      $language: <string>,
      $caseSensitive: <boolean>,
      $diacriticSensitive: <boolean>
    }
}
	注意：使用$text必须先建立索引，有且只能有一个索引，但是可以包含多个字段
	
	db.ExpressTimeLog.createIndex({ deliveredUserName: "text", inFirstUserName : "text"});	
*/
db.ExpressTimeLog.createIndex({ deliveredUserName: "text", inFirstUserName : "text"});	
//检索时只对建立索引的字段才有效

//检索文档中存在‘炯’
db.ExpressTimeLog.find({ 
	$text : {$search : "炯"}
});

//检索文档中存在‘炯’或者‘李’的记录
db.ExpressTimeLog.find({ 
	$text : {$search : "炯 李"}
});

//检索文档中存在‘炯’但是不存在‘李’的记录
db.ExpressTimeLog.find({ 
	$text : {$search : "炯 -李黔"}
});
//检索文档中包含‘炯 李黔’词组的记录
db.ExpressTimeLog.find({ 
	$text : {$search : "\"炯 李黔\""}
});
//还支持显示检索匹配度,并进行排序
db.ExpressTimeLog.find(
{ 
	$text : {$search : "炯 -李黔"}
}, 
{
  	score:{$meta:"textScore"}
}
).sort({score:{$meta:"textScore"}});

/*
	$where  [3.6+]
	可以构建复杂的查询语句，但是不建议使用，因为它是将bson转为json再进行操作，这样效率太低
*/
---------------------------------------
Array Query Operators(对数组进行查询的操作符)
---------------------------------------
/*
	$all [2.6+]		查询文档中指定数组中存在value1和value2的文档，注意：这是完全匹配，
	{ <field>: { $all: [ <value1> , <value2> ... ] } }
	
*/

db.test_array.find({
	tags : {$all : ["school","book"]}
});

//注意：如果这样写表示tags中只包含查询的元素的文档
db.test_array.find({
	tags : ["school","book"]
});

/*
	$elemMatch   		{ <field>: { $elemMatch: { <query1>, <query2>, ... } } }
	
	表示可以对数组元素进行多条件的查询
	
	需求：
		查询qty数组中只要存在有size为s，数量大于50或者size为m数量小于等于50的文档
*/

db.test_array.find({
	qty : {
		$elemMatch : {
			size : "S",
			num : {$gte : 50}	
		},
		$elemMatch : {
			size : "M",
			num : {$lte : 50}
		}
	}
});
//如果是两个$elemMatch没有其他操作符，那么就是或的关系，如果和$all配合那么and关系
db.test_array.find({
	qty : {
		$all : [
			{$elemMatch : {size : "M",num : {$gte : 100}}},
			{$elemMatch : {color : "blue",num : {$lte : 40}}}
		]
	}
});

/*
	$size		表示匹配文档中数组中元素的个数
	
	注意：只能匹配具体数量，也就是说不能和$gte,$lte配合使用
*/
db.test_array.find({
	tags : {$size : 2}
});
----------------------------------
Bitwise Query Operators(按位查询操作符)
----------------------------------
/*
	$bitsAllClear [3.2+]
*/

------------------------------------
Projection Operators
------------------------------------
/*
	$meta [2.6+]	可以显示匹配分数，也就是匹配程度
	{
		<query>,
   		{ score: { $meta: "textScore" } }
	}.sort({ score: { $meta: "textScore" } })
*/

/*
	$slice	切片，通俗讲就是将查询出来的结果进行切割，
	
	$slice : <num>
					如果是负整数，代表从后往前切，
					如果是正整数，代表从前往后
	$slice : [<skipNum> , <num>]
				 代表跳过skipNum个文档进行切割
					如果skipNum是负整数，代表从后往前切，
					如果skipNum是正整数，代表从前往后
*/
db.test_array.find({},{qty : {$slice : -1}});

db.test_array.find({},{qty : {$slice : [1,1]}});

/**
	也可以在管道中使用，
	
	需求：qty中size为6的数组的最后一个元素
*/
db.test_array.aggregate([
	{$match : {qty : {$elemMatch : {"size" : "6"}}}},
	{$project : {"qty" : {$slice : ['$qty',-1,1]}}}
]);


//如果长度不足，则显示为空
