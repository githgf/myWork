# 		[Docker镜像技术](www.docker-cn.com)                                        


Docker就是一次部署，处处运行，就相当于将软件运行环境、配置进行封装打包，增加复用性，减少运维和开发的部署成本

### docker优势：
    相对于虚拟机来说更加的小巧、启动快、可移植性好
    为什么：
        docker相对于虚拟机来说省略了硬件的虚拟化
        docker用的是宿主机的内核，在加载时不需要像虚拟机那样重新加载一个虚拟机内核从而减少加载时间
## 相关概念

### 架构：
    Docker使用C/S架构，Client 通过接口与Server进程通信实现容器的构建，运行和发布。client和server可以运行在同一台集群，也可以通过跨主机实现远程通信。

### 镜像（images）
```markdown
只读模板，相当于将linux系统打成一个镜像文件，可以创建容器
底层原理：
	实际上是由一层一层的文件系统组成的联合文件系统（UnionFS）
简单来说就是说一个镜像也许是由多个镜像组成，最大的好处就是共享资源
举个例子：
	tomcat有400多M，咋一看貌似只有tomcat一个文件系统，然而也许内部有centos、jdk等等镜像，这就是为什么镜像在下载的时候有一个一个的镜像id下载完成记录，这样的话在下载第一个文件的时候也许比较慢，后面就快了，因为可以直接复用
```

### 仓库（repository）
```markdown
是集中存放镜像的场所，分为共有仓库，私有仓库，公有仓库类似于github，docker最大的hub就是docker hub，如果没有自定义配置镜像下载地址，
    那么默认会从国外的网站下载，造成下载速度非常慢，所以一般会配置从阿里云上下载
```

### 容器（container）
```markdown
运行应用的场所，容器是从镜像创建的运行实例
```
##         docker命令

### docker 系统命令

    docker容器开机自启                  
        1.运行时指定                    docker run --restart=always [容器id]
        2.运行后修改                    docker update --restart=always [容器id]
    docker卸载
    	列出yum安装的docker				yum list installed | grep docker
    	删除安装的docker组件			  yum -y remove docker.x86_64
### docker镜像加速
    1.在阿里云上获取自己的镜像加速服务
    2.编辑或者新增/etc/daemon.json,也有可能在/etc/docker/daemon.json(自己理解daemon貌似是docker的守护线程)
    3.加入
        {
            "registry-mirrors": ["https://d3408dqq.mirror.aliyuncs.com"]
        }
    4.重新编译daemon.json文件
        systemctl daemon-reload
    5.重新启动docker
        systemctl restart docker
        或者
        service docker restart
### docker常用命令
#### docker帮助命令
    docker --version                                docker版本
    docker info                                     docker详细信息
    docker --help                                   命令的详细说明
#### docker镜像命令

```shell
docker images								查看所有镜像
docker commit -m="提交描述" -a="作者" {要创建的镜像名}：{标签名}		提交镜像（自定义镜像）
```

#### docker容器命令

docker运行的通用命令

```shell
docker run 
	-p {自定义的端口号}:{运行镜像的默认端口号}
	-P 															随机分配端口号
	-v 	{宿主机中的目标文件目录}
		：
		{容器中的目标文件目录}
		：
		{操作权限：ro（只读）、rw（读写：默认）、wo（只写）}				  		
		
	 	设置挂载点（相当于将容器中目标文件中的数据双向共享）
	 --volume-from [容器ID]											继承数据卷
	
```



docker运行容器的的两种方式:

```shell
交互式运行
docker run 	运行容器
	--name 		容器运行的别名
	-i			表示进行交互
	-t			打开伪终端（经常和i一起使用表示运行docker之后进入容器）
```

```shell
后台守护线程式
docker run -d 容器名
ps ：
	但是docker官方不推荐，因为docker机制就是，没有前台应用在交互，会默认自杀
	如果非要以这种方式运行，可以通过shell脚本

docker run -d tomcat /bin/sh -c "where true;do echo helloword;sleep 2;done"
意思就是让容器虽然已后台方式运行，但是也有前端交互，两秒输出一次 helloworld
```

```shell
docker ps 	查看容器列表
	-a			查看正在运行的
	-i			查看上一个运行的
	-n [number]	 查看最近number个数运行的
	-q			默认只显示容器编号（可以和前面参数连用）
docker stop [容器id或者name]		停止容器
docker start [容器id或者name]		启动容器
docker restart [容器id或者name]		重启容器
docker kill [容器id或者name]		强制停止
docker rm [容器id或者name]			删除停止的容器
		-f						  强制删除（相当于先执行停止在删除）
docker rmi [镜像id或者name]			删除镜像

docker rm -f $(docker ps -aq)		删除多个容器
docker logs 					   查看容器运行日志
	-t							  加入时间戳
	-f							  跟随最新的日志打印，也就是日志在实时显示在控制台
	--tail	number				   打印最后的number条记录					
	[容器id]		
docker top	[容器ID]				  查看容器内运行的进程
docker inspect 	[容器ID]			  查看容器的内部细节
docker exec -it [容器id] /bin/bash   在docker容器外部打开新的终端，并且可以启动新的进程 
docker attach [容器ID]			  进入docker容器打开新的终端，但不会启动新的进程
ctrl+p+q						  退出容器但是不会关闭容器
docker cp [容器ID]：目标文件路径  宿主机目录
								  将docker容器中的文件拷贝宿主机目录

```

### docker 推送自定义镜像到仓库

```shell
#1. 将自定义的容器打包成镜像
docker commit {镜像Id} {镜像名：版本号}
#此时docker images 可以看到自定义镜像
#2. 登录远程镜像仓库（以网易云举例）
docker login -u  {登录名} -p {密码}  hub.c.163.com
#3. 镜像打标签名 
docker tag {镜像id} hub.c.163.com/{用户名}/{标签}  （这也就是以后镜像的下载地址）
#4. docker push {上文的地址}

```



## docker容器数据卷

作用：保存docker容器运行时产生的数据，类似于redis的rdb和aof文件

特点：	

​	1.数据卷可在容器之间共享或重用

​	2.卷中的更改可以直接生效，且不会包含在镜像的更新中

​	3.数据卷的生命周期一直持续到没有容器使用它为止

测试：

```shell
1.首先运行一个容器
docker run -it -v /opt/shareData：/opt/testShare
结果：看到结果在宿主机、容器中分别新建了一个指定的文件
2.在容器/opt/testShare中新建文件test.txt并插入hello container,保存修改，退出容器
结果：在宿主机/opt/shareData有一个文件test.txt
3.宿主机修改test.txt文件，插入hello container，保存修改，进入容器环境
结果：在容器/opt/testShare中的test.txt文件新增加了一句话
4.exit退出容器。在宿主机/opt/testShare新建文件，host.txt
5.重新运行容器，在容器的目录下发现host.txt文件

----------------------------------------
结论：
	1.数据卷的数据可以实现宿主局和容器双向共享
	2.数据卷文件具有持久化，容器关闭之后，关联还在

```

使用容器构建数据卷：	

```shell
1.首先新建一个DockFile,编辑如下
  FROM centos（指定其后构建新镜像所使用的基础镜像）
  VOLUME ["/opt/dockerShare1","/opt/dockerShare2"]（容器中的挂载点）
  CMD echo "finish scuess !!!!"（指定在容器启动时所要执行的命令）
  CMD /bin/bash
2.使用docker build命令
  docker build -f /mydocker/DockerFile -t mycentos:1.01 .(最后这个点不能省略，否则报错)
```

## DockerFile

### 定义：

用来构建镜像的文件，由一组命令和参数组成

### 基础知识

1.dockerfile的执行顺序是从上往下

2.#表示注释

3.每一个保留字的指令必须大写，并且其后面必须有参数，否则报错

4.每一个指令都会创建一个镜像层

### 保留关键字

| 关键字        |                                       意义 |
| ---------- | ---------------------------------------: |
| FROM       |                          基础镜像，当前镜像基于那个镜像 |
| MAINTAINER |                              镜像维护者的名称和邮件 |
| RUN        |             **构建**容器（docker build）时执行的命令 |
| EXPOSE     |                              当前容器对外暴露的端口 |
| WORKDIR    |                        在创建容器后终端默认登录的工作目录 |
| ENV        |                 用来在构建镜像过程中设置环境变量，下文中可以引用 |
| ADD        |                    将宿主机目录下的文件拷贝进镜像，且自动解压 |
| COPY       |            类似于ADD，构建上下文的目录中的文件复制到新一层的镜像内 |
| VOLUME     |                      容器数据卷，用于数据保存、共享和持久化 |
| CMD        | 指定一个容器**启动**（docker run）时要运行的命令，可以有多个指令但是只有最后一个会生效(注意和run指令的区别) |
| ENTRYPOINT |                    和CMD类似，但多指令时不会被覆盖而是追加 |
| ONBUILD    |                父镜像在被子镜像继承后父镜像的onbuild被触发 |
|            |                                          |

### demo：

#### 创建自定义的镜像

```shell
#基于centos的镜像
FROM centos
#创建者和邮箱
MAINTAINER hgf<hgftest@126.com>
#环境变量
ENV MY_PATH /opt
#进入容器的初始目录
WORKDIR $MY_PATH
#在容器中安装vim工具
RUN yum -y install vim
#
RUN yum -y install  net-tools
#打印
CMD echo  "RUN ....... ." $MY_PATH
CMD /bin/bash

```

#### ENTRYPOINT试验

dockerfile_entrypoint：

```shell
FROM centos
MAINTAINER hgf<hgftest@126.com>
RUN yum -y install curl
ENTRYPOINT ["crul","-s","http://ip.cn"]
```

构建之后运行此dockerfile

```shell
docker build -f /mydocker/dockerfile_entrypoint -t ipfather.
docker run ipfather -i /bin/bash
```

此时不止会返回ip地址，还会返回包头

结论：

**1.执行docker run如果带有其他命令参数，不会覆盖ENTRYPOINT指令**

**2.ENTRYPOINT允许在运行时在最后添加指令，但是不允许有两个ENTRYPOINT，,也就是说如果dockerfile中出现两个ENTRYPOINT，执行的也是最后一个**

#### ONBUILD:

dockerfile_father

```shell
FROM centos
MAINTAINER hgf<hgftest@126.com>
RUN yum -y install curl
ONBUILD RUN echo "hello son,i`m your father............."
ENTRYPOINT ["crul","-s","http://ip.cn"]

构建父镜像：
	docker build -f /mydocker/dockerfile_father -t ipfather .

```



dockerfile_son

```shell
FROM ipfather
MAINTAINER hgf<hgftest@126.com>
ENTRYPOINT ["crul","-s","http://ip.cn"]

构建子镜像：	
	docker build -f /mydocker/dockerfile_son -t ipson .
```

结果：

```shell
Step 1/4 : FROM ipfather
# Executing 1 build trigger...
Step 1/1 : RUN echo "hello son,i`m your father "
 ---> Running in 0c995b936127

/bin/sh: -c: line 0: unexpected EOF while looking for matching ``'
/bin/sh: -c: line 1: syntax error: unexpected end of file
The command '/bin/sh -c echo "hello son,i`m your father "' returned a non-zero code: 1

```

#### 自定义的tomcat8

```shell

FROM centos

MAINTAINER hgf<1641197217@qq.com>

COPY dockerfile_entrypoint /usr/local/docker.txt

ADD apache-tomcat-8.0.53.tar.gz /usr/local
ADD jdk-8u121-linux-x64.tar.gz /usr/local

RUN yum -y install vim
ENV MY_PATH /opt
WORKDIR $MY_PATH

ENV JAVA_HOME /usr/local/jdk1.8.0_121
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV CATALINA_HOME /usr/local/apache-tomcat-8.0.53
ENV CATALINA_BASE $CATALINA_HOME
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

EXPOSE 8080
#ENTRYPOINT ["/usr/local/apache-tomcat-8.0.53/bin/startup.sh"]
CMD /usr/local/apache-tomcat-8.0.53/bin/startup.sh && tail -F /usr/local/apache-tomcat-8.0.53/logs/catalina.out

```



## docker 安装开发组件

### mysql

```shell
docker run --name mysql5.6 
-v /opt/mysql5.6/conf:/etc/mysql/conf.d
-v /opt/mysql5.6/logs:/var/log/mysql 
-v /opt/mysql5.6/datadir:/var/lib/mysql 
-e MYSQL_ROOT_PASSWORD=0626 
-d mysql:5.6
```

### jenkins

```shell
1.先从仓库中pull镜像
	docker pull jenkins
2.创建需要挂载的目录
	mkdir /opt/jenkins
3.设置目录的uid为1000，否则发生权限问题（https://yq.aliyun.com/articles/53990）
	chown -R 1000 jenkins
4.运行Jenkins
	docker run -p [8083]:8080 -p 50000:50000 -v /opt/jenkins:/var/jenkins_home jenkins
此事可能发生错误：
 		Error response from daemon: driver failed programming external connectivity on endpointlaughing_hypatia(6308ab72beb711eb0f7d6eaa5e0303ba2e82c8320cafd21417d8bb20a475de1d):  (iptables failed: iptables --wait -t filter -A DOCKER ! -i docker0 -o docker0 -p tcp -d 172.18.0.2 --dport 50000 -j ACCEPT: iptables: No chain/target/match by that name.

		解决方案：重启docker
```

## docker 中运行web应用

### 以jar包方式运行spring boot 的web应用

#### 方式一：以dockerFile形式构建

一：编写dockerFile如下
```dockerfile
# Version: 1.0.0
# Create Time: 2018-10-16
# Author: fanying
# Description: 在最新版本的 centos 系统中安装jdk，构建可执行java的环境

#基础镜像
FROM java:8 
MAINTAINER fanying "hgf1641197217@163.com"

VOLUME /tmp

#拷贝springboot 应用的jar（这里的jar地址不要有前缀）
ADD webflux.jar /opt/webflux/webflux.jar

#对外暴露端口
EXPOSE 8080

#CMD java -jar /opt/webflux/webflux.jar > /opt/webflux/webflux.log 2>&1 &
#docker run 指令运行的命令
ENTRYPOINT ["java","jar","/opt/webflux/webflux.jar",">","/opt/webflux/webflux.log","2>&1","&"]
```

二：构建镜像

```shell
docker build -f {dockerFile所在的路径} -t {镜像名：版本}
#注意dockerFile最好和file中需要加入的jar包、文件...在同一个目录下，否则docker 会在临时创建的文件中寻找文件
```

三：运行镜像

```shell
docker run -d \
		--name {容器别名} 
		-v /opt/file/:/opt/webflux/ 
		-p 8083:8080
        {容器的id}
```

