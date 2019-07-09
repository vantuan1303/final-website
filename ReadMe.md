#Create a new database with mongo:
+ mkdir mongodb 
(if non-exits)
+ mongod --dbpath ./mongodb --port 27018
Conect from client: 
+ mongo --port 27018
+ use db
+ db.createUser({user:"tuan", pwd:"12345678", roles: ["readWrite", "dbAdmin", "dbOwner"]});

#Restart server: 
+ mongod --dbpath ./mongodb/ --port 27018 --auth

#Conect againt from client:
+ mongo --port 27018 -u "tuan" -p "12345678" --authenticationDatabase "db"