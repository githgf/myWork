/*
	mongodb 提供了很好的LBS位置服务，通过客户端传过来的经纬度坐标和需求，产生需要的结果
	
	使用LBS服务必须要创建索引，而且指定索引类型，
		2dsphere	只能支持球面模型（效率更高）
		2d			可以支持球面和平面
	
	注意使用2dsphere格式的索引必须要让建立索引的字段符合GeoJson格式，
	https://www.oschina.net/translate/geojson-spec#examples
	http://www.mongoing.com/mongodb-geo-index-1/
*/

db.restaurants.ceateIndex({location : "2dsphere"});
db.neighborhoods.createIndex({geometry : "2dsphere"});

/*
	$geoIntersects[3.0+]  查找所在的坐标最贴近的区域，$geomerty [3.0+]
	格式：
		{
  <location field>: {
     $geoIntersects: {
        $geometry: {
           type: "Polygon" ,
           coordinates: [ <coordinates> ],
           crs: {
              type: "name",
              properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
           }
        }
     }
  }
}
	需求：
		假设用户所在位置的经纬度为：-73.93414657,40.82302903。
		为了找到当前的居民区，我们可以以GeoJSON的格式使用特定的$geometry字段：
*/
db.neighborhoods.findOne({
	geometry : {
	  $geoIntersects : {
	  	$geometry : {
	  		type : "Point",//GeoJson格式规定必须声明类型，和下文coordinate对应
	  		coordinates :[-73.93414657, 40.82302903 ]
	  	}
	  }
	}
});

/*
	$geoWithin[3.0+]		找出指定区间范围内所有的坐标信息
	{
   <location field>: {
      $geoWithin: {
         $geometry: {
            type: <"Polygon" or "MultiPolygon"> ,
            coordinates: [ <coordinates> ]
         }
      }
   }
}
	需求：
		找到现在用户所在地址的区域内所有的饭店

*/
var neighborhood = db.neighborhoods.findOne({
	geometry : {
	  $geoIntersects : {
	  	$geometry : {
	  		type : "Point",//GeoJson格式规定必须声明类型，和下文coordinate对应
	  		coordinates :[-73.93414657, 40.82302903 ]
	  	}
	  }
	}
});
//mongodb 允许将结果集保存为变量像js代码那样操作
db.restaurants.find({
	location : {
		$geoWithin : {
			$geometry : neighborhood.geometry
		}
	}
});
//输出的结果是所有数据库中符合条件也就是在范围内的饭店集合


/*
	$centerSphere  相当于根据指定的gps数据为圆心，以指定参数为半径划出圆形区域，经常和$geoWithin配合使用
	{
   <location field>: {
      $geoWithin: { $centerSphere: [ [ <x>, <y> ], <radius(半径)> ] }
   }
}
	注意半径是指弧度制的半径，也就是说要将  实际需要圆的半径/地球的半径（3963.2），单位都是公里
	
	需求：
		为了找到与某个点距离在5公里范围内的饭店,
*/
db.restaurants.find({
	location : {
		$geoWithin : {
			$centerSphere : [
				[ -73.93414657, 40.82302903],
				5/3963.2
			]
		}
	}	
});
// 与之相近的还有$center(只支持2d)、$box :  [[],[],[]](只支持2d)、$polygon (只支持2d): [[],[],[]]
	
/*
	$nearSphere [2.6+]	可以根据距离指定坐标一定范围内远近的顺序排序之后返回需要的结果集
	
	{
  $nearSphere: {
     $geometry: {
        type : "Point",
        coordinates : [ <longitude>, <latitude> ]
     },
     $minDistance[2.6+]: <distance in meters>,
     $maxDistance[2.6+]: <distance in meters>
  }
}

	需求：
		从近到远的顺序返回距离该用户5公里以内的所有饭店
*/
var METERS_PER_MILE = 1609.34;
db.restaurants.find({
location : {
  $nearSphere: {
     $geometry: {
        type : "Point",
        coordinates : [-73.93414657, 40.82302903]
     },
     $maxDistance: 30000
  }
}
});
// 与之相近的还有$near[2.6+]




