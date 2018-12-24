## 1.找不到参数

**问题描述**

​	@RequestParam Error: Required String parameter 'expressNos' is not present

**原因**：

​      requestParam注解 其实作用就是服务器接受到请求参数根据指定属性名进行赋值，类似于										request.getParam("")方法，所以请求的方式如果是get请求、post表单提交方式等，这些能通过getParam（“”）方法获取到值的请求方式，那么不会报错，

​         但是如果Content-Type指定了application/json这种方式，那么直接使用此注解获取参数的数据会报错的，

**解决方案**：（如果还是采用application/json）

​        1.将参数封装在类中，spring自动装配参数

​        2.将注解改为@RequestBody,然后用get("")方法获取

## 2.前后端交互时数组传递问题（不能转换....）

**问题描述**

控制层代码：

```java
@RequestMapping(value = "/comfirmexpressfee",method = RequestMethod.POST)
public Result comfirmExpressFee
     (@RequestHeader("Authorization") String auth,
     @RequestBody @ApiParam("运单号列表") List<String> expressNos){
。。。。。。
}
```

前端请求方式：

```json
Content-Type:application/json
{
	"expressNos" : ["301000000027","301000000028"]
}
```

**原因分析**

​	上文中的接收方式是直接接受数组，而传入的是一个json对象

**解决方案：**

​	1.修改传入的方式：直接 传这个 ["301000000027","301000000028"]

​	2.修改接收的方式：

```java
public Result comfirmExpressFee(
  @RequestHeader("Authorization") String auth,
  @RequestBody @ApiParam("运单号列表") JSONObject expressNoObject
  ){
    
    JSONArray expressNos = expressNoObject.getJSONArray("expressNos");
    return deliverAppHelper.comfirmExpressFee(expressNos.toJavaList(String.class),auth);
 }
//因为传入的是json对象，所以接收由spring转为JSONObject，之后获取数组，转化即可
//也可以将数组封装在一个类中，那么接受参数直接写那个对象
```

