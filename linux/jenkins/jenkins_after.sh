#最后运行的tomcat的目录
TOMECAT_HOME="/opt/tomcat-8_8081"
#tomcat运行端口
TOMECAT_PORT=8081
#jenkins打包成war包之后存放的目录
JENKINS_TARGET_HOME="/root/.jenkins/workspace/SpringBootDemo_free/target"
#jenkins打包成war包的名字
JENKINS_WAR_NAME="SpringBoot-1.0-SNAPSHOT.war"
#jenkins打包成war包的路径
JENKINS_WAR_HOME=$JENKINS_TARGET_HOME/$JENKINS_WAR_NAME
#tomcat下war最终的名字
FINAL_WAR_NAME="springBootDemo.war"

echo "[step 1:]  kill tomcat process is start"

#获取指定运行的tomcat进程号
tomcat_pid=`ps -ef | grep $TOMECAT_HOME | grep -v grep | awk '{print $2}'`

if [ -n "$tomcat_pid" ]
then 
      echo $tomcat_pid "tomcat process is starting========"
      kill -9 $tomcat_pid
      sleep 3
else
      echo "tomcat is shutdown........."
fi

sleep 3

#获取指定运行的tomcat进程号
#tomcat_pid=`ps -ef | grep $TOMECAT_HOME | grep -v grep | awk '{print $2}'`

#如果存在指定运行的tomcat进程，直接循环kill，直到没有
#while [ -n "$tomcat_pid" ]
#do
#	#statements
#	kill -9 $tomcat_pid
#	sleep 3
#	tomcat_pid=`ps -ef | grep $TOMECAT_HOME | grep -v grep | awk '{print $2}'`
#	echo "scan tomcat pid == " $tomcat_pid
#done

echo "[setp 2: ] cp " $JENKINS_WAR_HOME "to" $TOMECAT_HOME"/webapps/"

#将war包移动到tomcat的webapp目录下
cp $JENKINS_WAR_HOME $TOMECAT_HOME/webapps/

cd $TOMECAT_HOME/webapps/

echo "[setp 3 ] 准备运行环境....."

#将以前存在的war包删除
rm -rf $FINAL_WAR_NAME

#将war包重命名
mv $JENKINS_WAR_NAME  $FINAL_WAR_NAME

#将tomcat启动 的log日志清空
echo "" > $TOMCAT_HOME/logs/catalina.out

echo "[setp 4::] start tomcat "


#在jenkins环境中，一定要加上这行，否则shell脚本进程会被杀死
export BUILD_ID=dontKillMe

#运行tomcat
sh $TOMCAT_HOME/bin/startup.sh &

cat $TOMCAT_HOME/logs/catalina.out


