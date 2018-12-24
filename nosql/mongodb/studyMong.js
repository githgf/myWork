//and、or组合查询
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
