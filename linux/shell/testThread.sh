#!/bin/bash  
  
for((i=1;i<=2;i++));  
do   
echo $( curl --request GET --url http://localhost:8080/express/clientserver/data/thread);  
sleep 2
done  
