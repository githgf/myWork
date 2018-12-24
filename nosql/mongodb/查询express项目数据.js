db.ExpressTrajectoryLog.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {$or: [{"creator": "赵永恩"},{"creator": "毛元聪"}]}
		},

		// Stage 2
		{
			$project: {
					expressNo : 1,
					createTime : {$dateToString : {date : "$createTime",format : "%Y-%m-%d %H:%M:%S"}},
					_id : 0,
					trajectoryStatus : 1,
					title : 1,
					lat : 1,
					lng : 1,
					address : 1,
					remark  : 1,
					creator : 1,
					creatorId : 1
			}
		},
	],

	// Options
	{
		cursor: {
			batchSize: 50
		}
	}

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
