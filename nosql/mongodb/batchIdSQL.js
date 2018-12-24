
db.BatchOrderFinishLog.aggregate([
	{ "$project" : 	{ "userId" : 1 ,
	  				  "userLinkerTel" : 1 , 
	  				  "senderWaitTime" : 1,
	  				  "sub" : { "$subtract" : 
	  				    			[new Date() ,"$createTime"]
	  				  			}
	  				  }
	}
])


db.BatchOrderFinishLog.aggregate([
	{ "$project" : 	{ "userId" : 1 ,
	  				  "userLinkerTel" : 1 , 
	  				  "senderWaitTime" : { "$multiply" : [ "$senderWaitTime" , 1000, 60]},
	  				  "sub" : { "$subtract" : 
	  				    			[new Date() ,"$createTime"]
	  				  			}
	  				  }
	},
	{ "$match" : { 
	  	"$and" : [ 
	  				{ "senderWaitTime" : { "$exists" : true,}} , 
	  				{ "sub" : 
	  				  	{ "$gte" : "$senderWaitTime"}
	  				}
	  			  ]
	  			}
	}
])



