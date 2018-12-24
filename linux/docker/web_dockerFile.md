# Version: 1.0.0
# Create Time: 2018-10-16
# Author: fanying
# Description: 在最新版本的 centos 系统中安装jdk，构建可执行java的环境

FROM centos:latest 
MAINTAINER fanying "hgf1641197217@163.com"

# 将jdk安装压缩包解压到/home/jdk1.8.0_51
ADD jdk-8u51-linux-x64.tar.gz /home/

# 设置java环境变量
ENV JAVA_HOME=/home/jdk1.8.0_181
ENV PATH=$PATH:$JAVA_HOME/bin
ENV CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar


#拷贝springboot 应用的jar
ADD webflux.jar /opt/webflux/webflux.jar

EXPOSE 8080

ENTRYPOINT  java -jar /opt/webflux/webflux.jar > /opt/webflux/webflux.log 2>&1 &