docker run --name monngodb0 \
--restart always \
-v /data/db/mongodb0:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27017:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth


docker run --name monngodb1 \
--restart always \
-v /data/db/mongodb1:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27018:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth

docker run --name monngodb2 \
--restart always \
-v /data/db/mongodb2:/data/db \
-v /data/mongodb0_conf:/opt/keyfile \
-p 27019:27017 \
-d 8bf72137439e \
--smallfiles \
--keyFile /opt/keyfile/mongodb-keyfile \
--replSet rs0 \
--auth

db.createUser({
 user : "root",
 pwd : "mongodb",
 roles : [{role: "root", db: "admin"}]
});
db.createUser({
 user : "use1",
 pwd : "mongodb",
 roles : [{role: "read", db: "admin"}]
});


db.system.users.find()



version: '2'
services:
  m0: 
    image: mongo:4.0
    container_name: m0
    ports: 
    - "27017:27017" 
    command: /bin/sh -c 'mongod --replSet replset0'
    restart: always
  m1: 
    image: bolingcavalry/ubuntu16-mongodb349:0.0.1
    container_name: m1
    ports: 
    - "27018:27017"
    command: /bin/sh -c 'mongod --replSet replset0'
    restart: always
  m2: 
    image: bolingcavalry/ubuntu16-mongodb349:0.0.1
    container_name: m2
    ports: 
    - "27017:27017" 
    command: /bin/sh -c 'mongod --replSet replset0'
    restart: always


rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "106.12.35.133:27017" },
      { _id: 1, host: "106.12.35.133:27018" },
      { _id: 2, host: "106.12.35.133:27019" }
   ]
})

rs.slaveOk();
use admin
db.getMongo().setSlaveOk()
db.setSlaveOk()