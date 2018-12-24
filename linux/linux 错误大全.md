# Linux 错误大全					



## iptables服务打开、关闭失败

	Failed to restart iptables.service: Unit iptables.service failed to load
原因：
	centos 7没有安装iptables-service，cetons7升级防火墙为 一个叫 firewalld 的库了
解决方案：

1.卸载firewalled，使用iptables-service


```markdown
步骤：
	1.首先关闭并卸载 firewalld
		systemctl stop firewalld
		systemctl mask firewalld
	2.安装iptables-services
		yum install iptables-services
	3.重新启动
		systemctl enable iptables   设置开机启动
		systemctl stop iptables
		systemctl start iptables
		systemctl restart iptables
		systemctl reload iptables
	4.保存设置
		service iptables save
```

ping 域名访问失败，但是ping ip地址可行

```shell
#查看/etc/resolv.conf
cat /etc/resolv.conf
#如果不存在此文件，重启network服务
service network restart
ifconfg
#cat /etc/resolv.conf看看文件中有没有,没有则添加
nameserver 8.8.8.8
nameserver 8.8.4.4
#或者也可以直接在/etc/sysconfig/network-scripts/ifcfg-eth0添加
DNS1 8.8.8.8
DNS2 8.8.4.4
service network retart

```

## windows无法访问tomcat服务

可能原因：

​	1.tomcat没有启动成功

​	2.linux防火墙没有开启访问8080端口

解决步骤：

​	1.判断tomcat是否启动：

```markdown
ps -ef|grep tomat									正常情况下会出现一大堆东西
cat /opt/tomcat/logs/catalina.out					 看有没有报错信息
curl 127.0.0.1:8080									如果返回页面代码即为成功
```

​	2.如果tomcat没有成功，解决错误，如果成功继续排除

​		查看linux系统有没有开放8080端口

​		查看一下本机防火墙现有的规则列表

	iptables -L --line-number

​	3.如果没有开放，则添加端口

```markdown
编辑
vim /etc/sysconfig/iptables
添加端口
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
重启防火墙
systemctl restart iptables.service

```



## tomcat启动时端口被占用

```js
netstat -apn | grep 端口号
最后一个（进程号/程序）就是
kill -9 进程号
```
### window用远程连接工具（windcp、xshell）连接linux虚拟机连接不上

可能原因：

	1.虚拟机没有开放相应的端口
	2.虚拟机没有连上网
	3.虚拟机能联网但是window就是无法连接虚拟机
解决方案：

```shell
1.查看开放的端口有没有22
vim /etc/sysconfig/iptables
2.如果没有开放则添加即可
3.如果添加了，查看/etc/sysconfig/network-scripts/ifcfg-ens33(名字也许不同但是差不多)文件中ONBOOT=yes|no选项如果是no改为yes
4.如果还是不行，查看虚拟机的网络编辑设置（最有可能）
查看宿主机中的虚拟机网络配置有两个（VMware Network Adapter VMnet1，VMware Network Adapter VMnet8）
ps:
VMnet1是host-only连接方式
VMnet8是nat连接

右键VMnet8查看其ipv4的配置是不是和虚拟机中的ip前三个相同：
例如
虚拟机中的ip为192.168.244.128
VMnet8查看其ipv4的配置是192.168.144.1
则修改为192.168.244.1
```
## mysql错误

### 输入命令发现You must reset your password using ALTER USER statement before .......

```mysql
#原因：密码太简短，mysql有个初始密码那么，重置之后如果想要密码简单点，必须设置

#1.查看允许的密码长度，并设置为1：
	select @@validate_password_length；
	（此时直接修改这个参数是没有用的，必须先修改以下三个参数）
#2.查看大小写字母长度并设置为1
	select @@validate_password_mixed_case_count;
	set global validate_password_mixed_case_count=1；
#3.查看允许的数字长度，并设置为1
	 select @@validate_password_number_count;
	 set global validate_password_number_count=1；
#4.查看特殊字符长度，并设置为1
	select @@validate_password_special_char_count
	set global validate_password_special_char_count=1；
#5.此时在查看validate_password_length，并设置为1
	select @@validate_password_length；
	set global validate_password_length=1;
#6.最后设置想要的密码
	set PASSWORD=PASSWORD('password');
#7.退出之后重新登录即可。
```

### 远程连接mysql发现连接失败

原因：

​	有个mysql数据库中的user表，其中存放允许访问的host

解决：

```mysql
#1.查询host
	use mysql;
	select host from user;
#2.修改加入要访问的host（ip地址）
	update user set host = "%" where user = "root";
#3.重启mysql服务器
	systemctl restart mysqld.service(这个命令有些机器不一样，上网查查就行)
```



