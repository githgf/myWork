## 通过域名访问java web项目

1.将需要部署的项目打成war包

​	查看pom.xml文件中的

​		<packaging>war</packaging>

​	  	如果packaging节点是jar则打成jar包

​	通过idea的maven插件，clean 》install》package，最后的war包通过远程连接工具上传到指定运行的tomcat文件夹下的webapps文件夹

2.修改server.xml文件，修改以下节点

```xml
 <Engine name="Catalina" defaultHost="www.janqq.xyz">		
   <Connector port="80" protocol="HTTP/1.1"					
               connectionTimeout="20000"
               redirectPort="8443" />
    <Host name="www.janqq.xyz"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
    <Context docBase="/opt/tomcat-8_8081/webapps/springBootDemo" path="" reloadable="true"/>
  

```

最终文件

```xml
<Server port="8015" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />

  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />
  <GlobalNamingResources>
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>
	 <Service name="Catalina"> 
      <Connector port="80" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
    <Connector port="8019" protocol="AJP/1.3" redirectPort="8443" />
    <Engine name="Catalina" defaultHost="www.janqq.xyz">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      	</Realm>
      <Host name="www.janqq.xyz"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
          <Context docBase="/opt/tomcat-8_8081/webapps/springBootDemo" path="" reloadable="true"/>
          <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />
      </Host>
    </Engine>
  </Service>
</Server>

```

3.重启tomcat即可

## 通过ip地址访问spring boot项目（jar包）

思路：

​	将spring boot项目打包成jar包，通过远程工具或者jenkins也行，发送到远程服务器，将编辑好的shell脚本放在.sh文件中，设置权限，运行即可

开始：

​	1.将spring boot项目恢复成最开始的状态，（启动类、pom.xml文件的内置tomcat开启、jar包配置）

​	2.将spring boot项目打包成jar包，通过远程工具或者jenkins也行，发送到远程服务器

​	3.将以下脚本放到.sh文件中

```shell
java -jar /opt/springBootDemo/springBootDemo.jar > /opt/springBootDemo/springBootDemo.log 2>&1 &
#java -jar [jar路径] > [输出的日志文件地址] [2>&1 表示将正确信息和错误信息都输出] [& 表示后台运行]
```

详情见（spring boot部署在内部的tomcat容器上）



## 安装git

1： 安装编译 git 时需要的包

```shell
yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel
yum install -y gcc perl-ExtUtils-MakeMaker
```

2： 删除已有的 git

```shell
yum remove git
```

3： Git 官网下载 Git 最新版 tar 包. 编译安装

```shell
tar -zxvf git-2.9.3.tar.gz
cd git-2.9.3
make prefix=/usr/local/git all 
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc
```

## spring boot部署在内部的tomcat容器上

1.将项目打包成jar包，不要修改application类，并将jar发送到任意指定的目录

2.新建一个类似于tomcat的startup.sh的文件

```shell
vim startup.sh

添加如下信息
	java -jar /opt/demo/demo.jar > /opt/demo/demo.log 2>&1 &
# demo.jar 是jar包，建议为全路径名,demo.log是打印的日志， &表示后台运行，2>&1是将错误和正确输出打印到指定的日志文件
## 具体可见https://www.cnblogs.com/zhenghongxin/p/7029173.html

```

3.给startup.sh文件赋予权限，否则不能运行

```shell
chmod u+x *.sh

#.sh 表示给当前目录下的.sh文件赋予指定的权限
#chmod是权限管理命令change the permissions mode of a file的缩写。。
#u代表所有者，x代表执行权限。 + 表示增加权限
```

可能出现的问题：	

​	页面访问不了：

​	看看项目中的端口号是否开通放行
4.结束进程的命令文件（stop.sh）
```shell  
  # {if ($8 != "grep")} 意思是布包扣grep本身的进程，$8 代表第几列
  pid=`ps -ef|grep express|awk '{if ($8!="grep")print $2}'`
  echo $pid
  kill -9 $pid
  echo "停止原项目进程，pid=$pid"
```

##配置ssh远程服务

ssh相当于一张去远程服务器的通行证，在远程服务器上配置好本地服务器之后，方能进行连接

```shell
准备环境：
	被连接的远程服务器：(A)
		IP : 114.115.149.243
		密码：HGF19950626hgf
	连接的远程服务器：（B）
		IP : 118.25.194.36
		密码：hgf19950626hgf

在(B)服务器端配置
	1.生成公钥秘钥：
		ssh-keygen     生成的秘钥文件在/root/.ssh/下
	2.添加需要连接远程服务的服务器的认证
		ssh-copy-id -i /root/.ssh/id_rsa.pub root@118.25.194.36
		会让你输入服务器(A)的密码
		这一步是将公钥传送到A服务器的 .ssh/authorized_keys 并进行文本的添加
	3. 进入A服务器 将上一步的公钥文件（.ssh/authorized_keys）赋予权限
		chmod 600 .ssh/authorized_keys
	4.在服务器的/etc/ssh/sshd_cinfig文件下可以管理ssh服务：
		PasswordAuthentication yes/on ----------------------> 开启或者关闭密码连接
		PermitRootLogin yes/no ----------------------------->允许超级用户登录
		AllowUsers student----------------------------->只允许登录的用户
		DenyUsers student-------------------------->不允许登录的用户
在（A）服务器端的配置
	连接命令；
		ssh [-l login_name] [-p port] [user@]hostname
		此时不要密码即可登录
```

### centos 7 发送邮件
搭建环境：
1.首先确保有sendmail 或mailx 插件，centos7 默认是安装的
2.安装证书
```shell
  #新建一个证书安装目录
  mkdir -p /root/.certs/
  #下面的邮件服务器，根据自己情况定
  echo -n | openssl s_client -connect smtp.qq.com:465 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > ~/.certs/qq.crt
  certutil -A -n "GeoTrust SSL CA" -t "C,," -d ~/.certs -i ~/.certs/qq.crt
  certutil -A -n "GeoTrust Global CA" -t "C,," -d ~/.certs -i ~/.certs/qq.crt
  certutil -L -d /root/.certs
```
3.编辑/etc/mail.rc 文件，添加如下的段落
```shell
  #服务认证用的，相当于证书，在此之前操作的目录
  set nss-config-dir=/root/.certs
  set from=1694289437@qq.com
  set smtp=smtps://smtp.qq.com:465
  set smtp-auth-user=1694289437@qq.com
  #发送邮件的密码不是邮箱密码
  set smtp-auth-password=xuhexzqtcpqjfcji
  set smtp-auth=login
  #这不能少，否则报错
  set ssl-verify=ignore
```
命令行发送
```shell
  说明：
      #{subject}          标题
      #{receiverMail}     收件人
      #{content}          邮件内容

  #单纯发一封没有内容的邮件,要按三下回车，然后ctrl+d结束
  mailx -v -s "#{subject}" #{receiverMail}
  
  #由内容的邮件，直接回车
  echo "#{content}" | mailx -v -s "#{subject}" #{receiverMail}

```
###centos定时任务
定时任务的文件放在两个地方：
    1. /etc/crontab     这个还不清楚，像是全局配置
    2. /var/spool/cron 这里才是各个用户的定时任务，比如说root用户就是名为root的文件
  命令：
  服务级别：
    /sbin/service crond start //启动服务 
    /sbin/service crond stop //关闭服务 
    /sbin/service crond restart //重启服务 
    /sbin/service crond reload //重新载入配置 
  任务调度
    添加任务：crontab -e 按下回车就会进入  /var/spool/cron 目录下的文件然后添加任务
    删除任务：crontab -r
    查看任务：crontab -l

###centos 修改ssh的端口，增加安全
  1.修改ssh策略，保存
    vim /etc/ssh/sshd_config
    在Port 22 增加一行
    Port 10086
    并将两行都取消注释
    systemctl restart sshd 

  2.SELinux给SSH开放10086端口
    查看开放的端口
    semanage port -l|grep ssh
    增加开放端口
    semanage port -a -t ssh_port_t -p tcp 10086

  3.修改防火墙开放端口
    vim /etc/sysconfig/iptables
    增加
    -A INPUT -p tcp -m state --state NEW -m tcp --dport 10086 -j ACCEPT
    systemctl restart iptables.service

  4.腾讯云添加安全规则(不建议，一旦添加规则那么每增加一个开放端口，都要修改规则)

curl -X GET --header 'Accept: */*' 'http://hzexpress.wisready.com/express/clientserver/data/expressdatatwoexportmail'
curl -X GET --header 'Accept: */*' 'http://rydexpress.wisready.com/express/clientserver/data/expressdatatwoexportmail'
curl -X GET --header 'Accept: */*' 'http://rydexpress.wisready.com/express//clientserver/data/expresscoddataexporttomail'

###centos 添加jdk环境变量

```shell
  export JAVA_HOME=/home/jdk1.8.0_181
  export PATH=$PATH:$JAVA_HOME/bin
  export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```
http://mirror.bit.edu.cn/apache/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz


###centos 将指定的ip隐藏，端口映射访问
  当我们不想将实际的端口暴露时，我们可以通过防火墙的转发功能，添加端口映射，这样我们就可以通过访问不规则的端口号访问正常的服务
```shell
  #开启ip隐藏（最后的permanent 不可少表示永久有效，否则不生效）
    firewall-cmd --add-masquerade --permanent
  # 检查是否允许伪装IP，如果输出为yes，就ok
    firewall-cmd --query-masquerade 
  #添加端口映射
  # 将80端口的流量转发至8080
    firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080
  #查看是否映射成功
    firewall-cmd --list-forward-ports
```