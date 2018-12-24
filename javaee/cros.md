CROS技术：跨域访问技术
            也就是在前后端分离时采用的技术，比如说前端的页面部署在118.10.0.104:9300中，后端部署在118.10.0.182:9600中，那么可以采用此技术加上rest请求使得前端的请求能访问到后台
简单请求：（全部满足）
        发送的请求为
            get
            post、
            head之一
        请求头参数必须为下列集合中一种，不得人为增加
            Accept-Language             游览器接受的语言，当服务器能够提供一种以上的语言版本时要用到
            Content-Language            
            Accept                      浏览器可接受的MIME类型
            DPR
            Downlink
            Save-Data
            Viewport-Width
            Width
        Content-Type（不属于以下值之一
            text/plain
            multipart/form-data
            application/x-www-form-urlencoded
            ）

        
预检请求：（满足其一即可）
        与简单请求不同的是预检请求会预先发送一个OPTIONS类型的请求，判断服务器是否接受此请求，可以避免未知请求对数据造成未知的破坏
        使用了下面任一 HTTP 方法：
            PUT
            DELETE
            CONNECT
            OPTIONS
            TRACE
            PATCH
        人为设置了对 CORS 安全的首部字段集合之外的其他首部字段。该集合为：
            Accept
            Accept-Language
            Content-Language
            Content-Type (but note the additional requirements below)
            DPR
            Downlink
            Save-Data
            Viewport-Width
            Width
        Content-Type 的值不属于下列之一:
            application/x-www-form-urlencoded
            multipart/form-data
            text/plain
        请求中的XMLHttpRequestUpload 对象注册了任意多个事件监听器。
        请求中使用了ReadableStream对象。
            

            如果请求头参数为
                    Access-Control-Request-Method: POST（告诉服务器，实际请求方法为post请求）
                    Access-Control-Request-Headers: X-PINGOTHER, Content-Type（让服务器判断接不接受）
            响应头：
                    Access-Control-Allow-Origin: http://foo.example（允许访问的服务器地址）
                    Access-Control-Allow-Methods: POST, GET, OPTIONS（允许访问的请求方法）
                    Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
                    Access-Control-Max-Age: 86400（相应的有效时间）
    注意点：预检请求不支持重定向

后端在返回数据时，响应头中加入以下参数
        Access-Control-Allow-Origin：*  代表允许访问服务器端的外部服务器地址，*代表没有限制
        如果向后台传输了带有身份标识的请求
        Access-Control-Allow-Credentials: true 如果不加此参数那么游览器不会将请求返回给发送者
        同时不能设置“Access-Control-Allow-Origin：*”必须为具体的服务器地址


其他响应头：
    Access-Control-Expose-Headers：<>、<>
        跨域访问时XMLHttpRequest对象的getResponseHeader方法只能拿到一些基本的响应头：Cache-Control、Content-Language、Content-Type、Expire、Last-Modified、Param，如果要访问其他头信息，必须在服务器的响应头中加入此信息
        例如：    Access-Control-Expore-Headers：X-My-Coustom-header、X-Another-Custom-Header
    
    Access-Control-Allow-Credentials：true
        当此参数设置为true那么代表允许游览器解析reponse中的内容
    
    Access-Control-Allow-Methods：GET、POST
        表示服务器允许请求的方法
    
    Access-Control-Allow-Headers：<field-name>用于预检请求
        表示实际请求中，允许携带的字段
    
请求头：

    


