# JWT

## 定义

JWT是一种用于双方之间传递安全信息的简洁的、URL安全的表述性声明规范。

简单来说就是对传递的信息进行特殊加密，然后用独有的方式解密，加强信息的安全性

## 官网：https://jwt.io/



## 组成结构

jwt由header、payload、signature三部分组成，每个部分之间用 . 分隔，形式如下

xxxxxx.xxxxxxxx.xxxxxxx

### Header

形式如下

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

alg(algorithm)			算法类型：HSxxx、PSxxx、ESxxx、RSxxx

typ(type)				有好几种方式，大小写会出现不同的结果：jwt、JWT、SWT、swt

### Payload

这里存放在jwt产生的json型的token中需要的数据，因为jwt优点就是小巧、简洁，用json的形式携带数据在一定程度上减少数据库查询的次数

它包含了claim， Claim是一些实体（通常指的用户）的状态和额外的元数据，有三种类型的claim

*registered*, *public*, and *private* claims.

#### registered

是一些元数据，jwt自带的详情如					https://tools.ietf.org/html/rfc7519#section-4.1

#### public

https://www.iana.org/assignments/jwt/jwt.xhtml

#### private

自定义的字段数据，举例如下

```json
{
  "userName" : "1222",
  "age" : 12,
  "hobby" : "play piano"
}
```

### Signature

签名的创建必须由三个个部分组成（header、payload、secret [秘钥]），header中的alg字段是创建签名的算法，payload、secret让此签名独一无二

创建方法如下：

```java
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

![JWT.io Debugger](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-5.png)

## 如何使用

当用户使用它的认证信息登陆系统之后，会返回给用户一个JWT，用户只需要本地保存该token（通常使用local storage，也可以使用cookie）即可。 当用户希望访问一个受保护的路由或者资源的时候，通常应该在Authorization头部使用Bearer模式添加JWT，其内容看起来是下面这样：Authorization: Bearer <token>

因为用户的状态在服务端的内存中是不存储的，所以这是一种**无状态**的认证机制。服务端的保护路由将会检查请求头Authorization中的JWT信息，如果合法，则允许用户的行为。由于JWT是自包含的，因此减少了需要查询数据库的需要。 JWT的这些特性使得我们可以完全依赖其无状态的特性提供数据API服务，甚至是创建一个下载流服务。因为JWT并不使用Cookie的，所以你可以使用任何域名提供你的API服务而不需要担心跨域资源共享问题（CORS）

![img](https://segmentfault.com/image?src=http://source.aicode.cc/markdown/jwt-diagram.png&objectId=1190000005047525&token=fc83f4c0cf107cabeafd6a449cd49762)



### demo

```java
package cn.hgf.springdemo.common.tool.util;

import cn.hgf.springdemo.common.CommonParam;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.commons.codec.binary.Base64;

import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @Author: FanYing
 * @Date: 2018-08-13 20:17
 * @Desciption:
	采用的是jjwt的包，是基本于JWT, JWS, JWE, JWK框架的java实现。 
 */	
public class JwtUtil {

    public static int calendarField = Calendar.DATE;
    //过期天数  10 天
    public static int calendarInterval = 10;

    public static String createToken(String userName,String password,int age) throws UnsupportedEncodingException {
        Map<String,Object> headerMap = new LinkedHashMap<>();
        headerMap.put("alg",CommonParam.JWT_ALG);
        headerMap.put("typ","JWT");

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(calendarField, calendarInterval);
        Date expiresDate = nowTime.getTime();

        return
        Jwts.builder()
                .setHeaderParams(headerMap)
                .claim("userName",userName)
                .claim("password",password)
                .claim("age",age)
                .setIssuedAt(nowTime.getTime())                                            //设置创建时间
                .setExpiration(expiresDate)                                                 //设置过期时间
                .signWith(SignatureAlgorithm.HS256,createSecretKey()).compact();                   //根据秘钥生成


    }

    public static SecretKeySpec createSecretKey(){

        byte[] encodedKey = Base64.decodeBase64(CommonParam.JWT_SECRETKEY);

        return new SecretKeySpec(encodedKey, SignatureAlgorithm.HS256.getJcaName());
    }

    public static Claims parseToken(String token){
        return
        Jwts.parser()
                .setSigningKey(createSecretKey())
                .parseClaimsJws(token).getBody();

    }

    public static void main(String[] args){

        String jack = null;
        try {
            jack = createToken("jack", "123", 12);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        System.out.println(parseToken(jack).get("userName"));
    }
}

```

