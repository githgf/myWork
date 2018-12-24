
db.ExpressTimeLog.insertOne({
	 "expressNo" : "301000002551", 
    "storeId" : "5b18869212b600542de06e05", 
    "storeNo" : "HU\n 02", 
    "addTime" : NumberLong(1529931249509), 
    "deliveredNum" : NumberLong(4), 
    "updateTime" : ISODate("2018-07-02T01:21:49.032+0000"), 
    "updatorId" : "5b067fe7d6137c78df640346",
    "inUserName" : "李黔",
    "deliveredUserName" : "炯",
    "inFirstUserName" : "何程黔"
})

/*
	db.collection.update(
   		<query>,
   		<update>,
   	{
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   	}
	)
	query : update的查询条件，类似sql update查询内where后面的。
	update : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
	upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
	multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
	writeConcern :可选，抛出异常的级别。
*/


