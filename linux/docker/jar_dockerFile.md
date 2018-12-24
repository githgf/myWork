# Version: 1.0.0
# Create Time: 2018-10-16
# Author: fanying
# Description: 在最新版本的 centos 系统中安装jdk，构建可执行java的环境

FROM java:8 
MAINTAINER fanying "hgf1641197217@163.com"

VOLUME /tmp

#拷贝springboot 应用的jar
ADD webflux.jar /opt/webflux/webflux.jar

EXPOSE 8080

#CMD java -jar /opt/webflux/webflux.jar > /opt/webflux/webflux.log 2>&1 &
ENTRYPOINT ["java","-jar","/opt/webflux/webflux.jar",">","/opt/webflux/webflux.log","2>&1","&"]