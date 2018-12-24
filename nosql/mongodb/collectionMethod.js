/*
	mongodb中集合所用的方法
*/

/*
	db.collection.group({ 	key,					分组的字段
	   						reduce, 				对每个文档进行操作 function(curr,result)
	   						initial 				初始化	function
	   						[, keyf] 				function
	   						[, cond] 				查询的条件[非必须]
	   						[, finalize] 			最后的操作[相当于finally]function(result)
	   					})
	
*/
db.test_array.group({
	
})
