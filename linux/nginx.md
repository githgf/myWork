# 是什么

个人理解，nginx是一个代理服务器群

[官网](https://www.nginx.com/resources/wiki/)

# 能干啥

## 反向代理服务器

![反向代理服务器](https://images2015.cnblogs.com/blog/398358/201602/398358-20160202133724350-1807373891.jpg)

反向代理服务器架设在服务器端，通过缓冲经常被请求的页面来缓解服务器的工作量，将客户机请求转发给内部网络上的目标服务器；并将从服务器上得到的结果返回给Internet上请求连接的客户端，此时代理服务器与目标主机一起对外表现为一个服务器。

请求的流程：

​	客户端 	--->	外网  --->  Nginx代理服务器  --->   （内网）真正接受请求的服务器

优势：

​	负载均衡：减少高并发流量，Nginx自动检测指定的服务器群中哪台服务器最空闲，减缓服务器压力

​	请求转发：对请求url进行初步筛选，如果是上传图片那么直接访问图片服务器

​	安全：不允许直接访问主服务器群，减少网络攻击

## 正向服务器



正向代理，架设在客户机与目标主机之间，只用于代理内部网络对Internet的连接请求，客户机必须指定代理服务器,并将本来要直接发送到Web服务器上的http请求发送到代理服务器中。	

可以用来翻墙

## 负载均衡

请求数量按照一定的规则进行分发到不同的服务器处理的过程

算法：

- weight轮询（默认）：权值越大，分到的可能性越大
- ip_hash：每个请求按照发起客户端的ip的hash结果进行匹配，这样的算法下一个固定ip地址的客户端总会访问到同一个后端服务器，这也在一定程度上解决了集群部署环境下session共享的问题。


- fair：智能调整调度算法，动态的根据后端服务器的请求处理到响应的时间进行均衡分配，响应时间短处理效率高的服务器分配到请求的概率高，响应时间长处理效率低的服务器分配到的请求少
- url_hash：按照访问的url的hash结果分配请求，每个请求的url会指向后端固定的某个服务器，可以在nginx作为静态服务器的情况下提高缓存效率

# 安装

```shell
#下载相关组件
wget http://www.openssl.org/source/openssl-fips-2.0.10.tar.gz
wget http://zlib.net/zlib-1.2.11.tar.gz
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.40.tar.gz
wget http://nginx.org/download/nginx-1.10.2.tar.gz

#安装C++编译环境
yum install gcc-c++

#安装各个组件
#openssl组件
tar -zxvf openssl-fips-2.0.10.tar.gz
cd openssl-fips-2.0.10
./config && make && make install

#安装prce（其余均一样）
tar zxvf pcre-8.40.tar.gz
cd pcre-8.4.0
./configuration && make && make install

#安装后Nginx目录在/usr/local/nginx中

```

# 启动、重启

```shell
#启动
cd {nginx_home}/sbin/ 
./nginx

#指定配置文件启动
./nginx -t -c {conf_path} 

#重启
./nginx -s reload

#检查配置文件
./nginx -t

#关闭
ps -ef | grep nginx

　　从容停止   kill -QUIT 主进程号

　　快速停止   kill -TERM 主进程号

　　强制停止   kill -9 主进程号
```



启动之后 访问 ip 出现界面为成功

# 简单反向代理

目的：现在118.25.194.36 的服务器上有web项目，但是只能通过ip:8080 访问，需要通过nginx使得为web项目能通过腾讯云上购买的域名访问（www.janqq.xyz）

修改配置文件

```shell
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
worker_processes 1;  #允许生成的进程数，默认为1(要和服务器cpu数量符合最好)
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg

events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}

http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log combined;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

	#被代理的服务器集群
    upstream mysvr {   
      server 118.25.194.36:8080 weight=6;(weight为权值)    
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       80;   #监听端口
        server_name  www.janqq.xyz;   #监听地址       
        location  / {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```







