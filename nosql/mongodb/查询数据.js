use test;
db.teach.find({})

db.order.insertMany(
[
{
		userId:"1",
		name:"user1",
		inDate:"2018-05-31",
		expressNo:"564564"
	},
	{
		userId:"2",
		name:"user2",
		inDate:"2018-05-31",
		expressNo:"32132"
	},
	{
		userId:"3",
		name:"user3",
		inDate:"2018-05-31",
		expressNo:"23131"
	},
	{
	  	userId:"1",
		name:"user1",
		inDate:"2018-05-30",
		expressNo:"5644"
	},
	{
		userId:"2",
		name:"user2",
		inDate:"2018-05-30",
		expressNo:"654654"
	},
	{
		userId:"3",
		name:"user3",
		inDate:"2018-05-30",
		expressNo:"23132"
	},
	{
	  	userId:"1",
		name:"user1",
		inDate:"2018-05-29",
		expressNo:"9878"
	},
	{
		userId:"2",
		name:"user2",
		inDate:"2018-05-29",
		expressNo:"5646"
	},
	{
		userId:"3",
		name:"user3",
		inDate:"2018-05-29",
		expressNo:"0365"
	}
	]
)

db.order.drop();

db.order.insert(
	{
		
		userId:"3",
		name:"user3",
		inDate:"2018-05-28",
		expressNo:"9878"
	}
	
);

db.order.aggregate(
	{$unwind:"$name"}
)


--通道使用
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



db.order.aggregate(
	{
	
		"$match":{
					"inDate":{"$lte":"2018-05-31","$gte":"2018-05-30"}
				}
	}
)



db.order.find({});

// group
db.order.group(
{
	key:{"name":1,"inDate":1,"userId":1},
	initial:{"count":0},
	reduce:function(doc,out){out.count++;},
	condition:{"inDate":{"$gte":"2018-05-12","$lte":"2018-05-31"}},
	finalize:function(out){return out;}
}	
);



















