----------------------------------------------
 Field Update Operators(字段更新操作符)
----------------------------------------------

/*
	$currentDate [3.0+]		设置字段为当前时间
	
	$type 列表在mongodb.md中有，https://docs.mongodb.com/manual/reference/operator/query/type/index.html
*/

//需求 ： 修改指定_id编号的文档的sendTime字段值为当前时间,类型是Date
db.DeliverGPSLog.update(
{"_id": ObjectId("5b39c813d233523d1fc210a1")},
{
	$currentDate : {lastModified: true,"sendTime" : {$type : "date"}}
}
);

/*
	$inc 对指定的字段进行增加指定数值
	

*/

db.DeliverGPSLog.update(
	{"_id" : ObjectId("5b39c813d233523d1fc210a1")},
	{
		$inc : {effective : 1}
	}
);

/*
	$min 对指定字段的数值和value1进行比较取两者之间最小的
	{ $min: { <field1>: <value1>, ... } }
	
	$min 对指定字段的数值和value1进行比较取两者之间最大的
	{ $max: { <field1>: <value1>, ... } }
	
*/

db.DeliverGPSLog.update(
	{"_id" : ObjectId("5b39c813d233523d1fc210a1")},
	{
		$min : {effective : 2}
	}
);

/*
	$mul 对指定的字段数值更新为原来数据额和number1的乘积
	{ $mul: { <field1>: <number1>, ... } }

*/

/*
	$rename	对指定字段进行重命名
	{$rename: { <field1>: <newName1>, <field2>: <newName2>, ... } }
	
*/

/*
	对指定字段进行重新的赋值
	{ $set: { <field1>: <value1>, ... } }
	
*/

/*
	$setOnInsert	
		upsert : true 》》》如果字段存在则不做修改，不存在则创建新字段
		
	db.collection.update(
   <query>,
   { $setOnInsert: { <field1>: <value1>, ... } },
   { upsert: true }
)
*/
db.DeliverGPSLog.update(
	{"_id" : ObjectId("5b39c813d233523d1fc210a1")},
	{$setOnInsert : {llll : 0}},
	{upsert : true}
);

/*
	$unset	删除已有字段
	{ $unset: { <field1>: "", ... } }
	
*/

-------------------------------------------------------------
Array Update Operators¶（数组更新操作符）
----------------------------------------------------------
/*
	$(update)
		db.collection.update(
   	{ <array>: value ... },
   	{ <update operator>: { "<array>.$" : value } }
	)
		当数组结构只是单纯的"grades" : [ 85, 82, 80 ]形式，使用此操作符，会将数组中第一个符合条件的数值改变
*/
db.test_array.update(
	{tags : {$all : ["school"]}},
	{$set : {"tags.$" : "school_2"}}
);
//此操作将第一个符合查询条件的文档的指定数组中的school元素改为school_2

/*	
	db.collection.update(
   { <query selector> },
   { <update operator>: { "array.$.field" : value } }
)
	当数组结构如下
	"grades" : [
      1.{ "grade" : 80, "mean" : 75, "std" : 8 },
      2.{ "grade" : 85, "mean" : 90, "std" : 6 },
      3.{ "grade" : 85, "mean" : 85, "std" : 8 }
   ]
   会将符合条件的第一个数组的元素的指定字段数值改变，也就是2中的std变为6
*/

db.test_array.update(
	{"qty.size" : "6"},
	{$set : {"qty.$.num" : 200}}
);

/*
	$[]   [3.6+]
	db.collection.updateMany(
   { <query conditions> },
   { <update operator>: { "<array>.$[]" : value } }
)
	对数组中所有元素进行修改
*/

/*
	$addToSet
	{ $addToSet: { <field1>: <value1>, ... } }
	
	在数组中添加元素	
		注意： 如果数组中存在要插入的元素则不会进行此操作
*/
//如果以数组形式插入
db.test_array.update(
	{"_id" : ObjectId("5b500abd8b2e64a06786722a")},
	{$addToSet : {tags : ["testAdd"]}}
);
//将单个元素直接插入数组
db.test_array.update(
	{"_id" : ObjectId("5b500abd8b2e64a067867229")},
	{$addToSet : {tags : "testAdd"}}
);

//向指定文档中指定数组中插入不存在的元素
db.test_array.update(
	{"_id" : ObjectId("5b500abd8b2e64a067867229")},
	{$addToSet : {tags : {$each : ["testAdd","testAdd_2","test_3"]}}}
);

/*
	$pop  删除数组中最后一个或第一个元素（-1代表第一个，1代表最后一个）
	{ $pop: { <field>: <-1 | 1>, ... } }
	
*/


/*
	删除数组中符合条件的元素
	{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
*/
	

/*
	想数组中添加元素，如果数组不存在则创建
	{ $push: { <field1>: { <modifier1>: <value1>, ... }, ... } }
	modifier：详情见上下文
		$sort		对结果进行排序
		$each		代表数组元素
		$slice		切割	
		$postion	下标，也就是从哪个位置开始插入（不写则默认在最后插入）
*/


/*
	$each		通常和$addToSet和$push配合使用
*/

