# Go

## 简述：

### 是什么

c、c++这种语言运行非常快，但是开发很慢，

python开发很高效但是运行慢，因为是解释型脚本，边解释边运行

而Go就像是python+c的结合

Go : 一种静态强类型、编译型、并发型，并具有垃圾回收功能的编程语言

优势：

- 简洁、快速、安全
- 并行、垃圾回收
- 内存管理、数组安全、编译迅速

### 能干吗：

1. 云分布式计算
2. 高并发服务端、游戏服务器的开发
3. 分布式文件服务器

## 运行方式

Go 有两种运行方式：

       	1. 直接运行 go run 有main方法的*.go 文件，

2.执行go build 命令将* .go 文件编译生成一个*.exe 文件（windows环境中），然后直接运行该文件

区别：

​	第一种方式方便查看运行结果，但是不适用在正式开发，因为运行慢

​	第二种的运行速度快，而且编译之后可以再别的没有go环境的机器上运行，但是文件很大，因为导入了运行该文件需要记得第三方包或者其他

## 语法：

go语言运行入口必须有main方法

go文件中引入的包必须使用，否则编译不通过

方法中声明的变量没有被使用则编译不通过

### 数据类型

基本数据类型：

​	布尔类型：bool

​	字符串类型：string

​	数字类型：

​		整数型：

​			有符号：int、int8、int16、  int32（rune） 、 int64

​			无符号：uint uint8（byte）、 uint16、 uint32、 uint64 、uintptr（存放指针）

​			其中int、uint 在不同位的操作系统中不同大小，32位大小为int4,64位中大小为int8

​		浮点型：float32、 float64、**complex64** 32 位实数和虚数  、  **complex128** 64 位实数和虚数

派生类型：

​	指针类型（Pointer）、 数组类型、 结构化类型(struct)、 Channel 类型、函数类型、切片类型

​	 接口类型（interface）、 Map 类型

### 变量的声明

单变量的声明：

​	（a）var 变量名 [数据类型]

​	（b）var 变量名 = value	类型自动推断

​	（c）变量名 := value （这种方式相当于先声明一个变量然后给变量赋值，**只能在函数体内出现，并且：左边的变量必须是没有声明过的**）

多变量声明：

​	（a）var 变量1 变量2 .... 变量n  type

​	（b）var 变量1 变量2 .... 变量n = value1，value2，....value n

​	（c）变量1 变量2 .... 变量n := value1，value2，....value n（注意点和上文类似）

​	（d）

```go
// 这种因式分解关键字的写法一般用于声明全局变量
var (
    vname1 v_type1
    vname2 v_type2
)
```

注意点：

​	1.不能对同一变量进行重复声明

​	2. 常量和局部变量冲突时，在函数体内会默认局部变量

```go
package main

import "fmt"
var i = 12
var k = 13;
func main () {
	i,k := 9,10
	fmt.Printf("i 的值是 %d,k 的值是 %d",i,k)
}
====================================================>
i 的值是 9,k 的值是 10
```

### 常量的声明

常量中的数据类型只可以是布尔型、数字型（整数型、浮点型和复数）和字符串型。

常量的声明使用关键字：const

命名方式和变量类似，

```go
//显式类型定义： 
	const b string = "abc"
//隐式类型定义： 
	const b = "abc"
//多个相同类型的声明可以简写为：
	const c_name1, c_name2 = value1, value2

//常量还可以用作枚举：

const (
    Unknown = 0
    Female = 1
    Male = 2
)
```

iota

​	iota 是一个特殊的常量，可以被编译器修改，可以被用作枚举，并且每增加一行， iota就会 + 1

```go
//快速将a，b，c赋予1,2，3
const（
	a = iota
	b
	c
）

const (
            a = iota   //0
            b          //1
            c          //2
            d = "ha"   //独立值，iota += 1
            e          //"ha"   iota += 1
            f = 100    //iota +=1
            g          //100  iota +=1
            h = iota   //7,恢复计数
            i          //8
    )

const (
    i=1<<iota 	//iota = 0
    j=3<<iota	//iota = 1
    k			//3<<iota = 3 << 2
    l			//3<<iota = 3 << 3
)
```

### 流程语句

#### switch

用法和其他语言中switch类似，不同的是当执行结果为true时，go语言会自动退出，不需要加break，

```go
fmt.Print("Go runs on ")
switch os := runtime.GOOS; os {
  case "darwin":
  fmt.Println("OS X.")
  case "linux":
  fmt.Println("Linux.")
  default:
  fmt.Printf("%s.", os)
}
//go语言中case还可以是一个函数
fmt.Println("When's Saturday?")
today := time.Now().Weekday()
switch time.Saturday {
  case today + 0:
  fmt.Println("Today.")
  case today + 1:
  fmt.Println("Tomorrow.")
  case today + 2:
  fmt.Println("In two days.")
  default:
  fmt.Println("Too far away.")
}
//如果switch的表达式为空，则代表true
t := time.Now()
switch {
  case t.Hour() < 12:
  fmt.Println("Good morning!")
  case t.Hour() < 17:
  fmt.Println("Good afternoon.")
  default:
  fmt.Println("Good evening.")
}
```



### 循环语句

go 语言中只提供了一种循环for循环，有以下三种写法

1.和大部分语言中的for类似

​	for init; condition; post { }

2.和while语句类似

​	for condition{}

3.和for(;;)类似

​	for {}

### 函数声明使用

#### 函数声明：

​	func 函数名 ([参数...]) (返回值类型.....)

go语言中函数可以返回多个值

```go
func main() {
	a, b := swap("hello", 2)
	fmt.Println(a, b)
}

func swap(i string, k int) (int, string) {
	return k * 2, i + "asd"
}
//当函数返回多个值接收时的值得用，分隔多个值接受，如果某一个值不想接收，可以用占位符_代替
pp,ll := swap("1",1)
_,ll := swap("1",1)
```

#### 函数的参数传递

函数的形参传递类型分为两种

​	值传递：形参的改变不会改变实参（默认情况下，Go 语言使用的是值传递，即在调用过程中不会影响到实际参数。）

​	引用传递：形参的改变会改变实参

```go
//引用传递的dmeo
func main() {
	a, b := "hello", 2
	fmt.Println(a, b)
	swap(&a,&b)
	fmt.Println(a, b)
}

func swap(i *string, k *int) {
	*k *= 2
	*i += "hello" 
}
//最后输出结束：
//hello 2
//hellohello 4

```



#### 函数的使用

作为变量使用：函数定义后可作为值来使用

```go
func main(){
   /* 声明函数变量 */
   getSquareRoot := func(x float64) float64 {
      return math.Sqrt(x)
   }

   /* 使用函数 */
   fmt.Println(getSquareRoot(9))

}
```

闭包：闭包是匿名函数，可在动态编程中使用  

闭包的特征就是函数的返回值是一个函数，可以实现延迟执行函数

```go
func main() {
	f := add()
	f(12)
	f(24)
	f(13)
}

func add() func(int){
	x := 12
	return func(de int){
		x += de
		fmt.Println(x)
	}
	
}
//24
//48
//61
```

方法：一个方法就是一个包含了接受者的函数，接受者可以是命名类型或者结构体类型的一个值或者是一个指针。所有给定类型的方法属于该类型的方法集，类似于java中某一个中定义的方法，

```go
/* 定义结构体 */
type Circle struct {
  radius float64
}

func main() {
  var c1 Circle
  c1.radius = 10.00
  fmt.Println("圆的面积 = ", c1.getArea())
}

//该 method 属于 Circle 类型对象中的方法
func (c Circle) getArea() float64 {
  //c.radius 即为 Circle 类型对象中的属性
  return 3.14 * c.radius * c.radius
}
```

#### init 函数

init 函数是go语言自带的函数，会在main函数之前使用

#### 内置函数：

​	go语言包含了大量的[内置函数](https://studygolang.com/pkgdoc)，这些函数不需要引入任何的包就能使用，new(..),make(...)等等

### 执行顺序

go语言文件执行顺序：全局变量 -> 导入包的init函数 -> main函数

### 数组声明、使用

数组声明：

```go
//一位数组的声明
var 数组名 [数组大小]	类型
//、初始化
var 数组名	 = [数组大小] 类型{数组元素....}

var 数组名	 = [] 类型{数组元素....}
//未知大小，这里的三个点是固定的，不能多不能少
var 数组名	 = [...] 类型{数组元素....}

//二维数组初始化
//注意最后的,不能少，因为最后的}单独一行
var balance = [3][4]int{
  {1,2,3,4},
  {5,6,7,8},
}
//否则如下写法
var balance = [3][4]int{
  {1,2,3,4},
  {5,6,7,8}}
```

作为参数传递

```go
func myFunction(param [10]int){}
func myFunction(param []int){}
```

注意数组的长度定义完之后是不可变的，后面说的切片slice是可变的

### 指针

```go
func main() {
   var a int= 20   /* 声明实际变量 */
   var ip *int        /* 声明指针变量 */

   ip = &a  /* 指针变量的存储地址 */

   fmt.Printf("a 变量的地址是: %x\n", &a  )

   /* 指针变量的存储地址 */
   fmt.Printf("ip 变量储存的指针地址: %x\n", ip )

   /* 使用指针访问值 */
   fmt.Printf("*ip 变量的值: %d\n", *ip )
}
/*
	a 变量的地址是: 20818a220
	ip 变量储存的指针地址: 20818a220
	*ip 变量的值: 20
*/
```

空指针：当一个指针没有被赋值就是nil，空指针

```go
//判断是否是空指针
ptr == nil
```

指针数组的使用

```go
func main() {
   a := []int{10,100,200}
   var i int
   var ptr [MAX]*int;

   for  i = 0; i < MAX; i++ {
      ptr[i] = &a[i] /* 整数地址赋值给指针数组 */
   }

   for  i = 0; i < MAX; i++ {
      fmt.Printf("a[%d] = %d\n", i,*ptr[i] )
   }
}
```

指向指针的指针

```go
//1.指针的声明
	//指针意思就是指向一个变量存储的地址，也就是说其存储的是被指向的变量的地址值
	var ptr *int = &i  //
	fmt.Printf("i 中的变量值是 ==>  %d\n",i)
	//当不加*时表示的是 i 这个变量的地址值
	fmt.Printf("ptr 中的类型是 ==>  %T,  值 ==> %d\n",ptr,ptr)	
	//加*时代表的是 i 这个变量的实际值，也就是说引用i 变量的值
	fmt.Printf("*ptr 中的类型是 ==>  %T, 值 是 == >  %d\n",*ptr,*ptr)	
	//也就是说 *ptr 其实就是int 类型了
	fmt.Printf("&*ptr 中的类型是 ==>  %T, 值 是 == >  %d\n",&*ptr,&*ptr) 
	
/*
	i 中的变量值是 ==>  1
    ptr 中的类型是 ==>  *int,  值 ==> 4284448
    *ptr 中的类型是 ==>  int, 值 是 == >  1
    &*ptr 中的类型是 ==>  *int, 值 是 == >  4284448	
*/

	//声明一个指向指针的指针
	var ppter = &ptr
	//因为ptr是一个指针，代表的是被指向对象（i）的地址值，所以，pptr存储的是ptr的地址值
	fmt.Printf("pptr 中的类型是 ==>  %T,  值 ==> %d\n",ppter,ppter)		
	//*pptr代表的是 被ptr指向的对象 i 中的地址值
	fmt.Printf("*pptr 中的类型是 ==>  %T, 值 是 == >  %d\n",*ppter,*ppter)	
	//**pptr代表的是指向ppter指向的ptr指向的i变量，也就是i的值
	fmt.Printf("*pptr 中的类型是 ==>  %T, 值 是 == >  %d\n",**ppter,**ppter)
/*
	pptr 中的类型是 ==>  **int,  值 ==> 4251944
    *pptr 中的类型是 ==>  *int, 值 是 == >  4284448
    **pptr 中的类型是 ==>  int, 值 是 == >  1
*/
	var pppter = &ppter
	fmt.Printf("pppter 中的类型是 ==>  %T,  值 ==> %d\n",pppter,pppter)
	fmt.Printf("*pppter 中的类型是 ==>  %T, 值 是 == >  %d\n",*pppter,*pppter)
	
/*
    pppter 中的类型是 ==>  ***int,  值 ==> 4251960
    *pppter 中的类型是 ==>  **int, 值 是 == >  4251944
*/
```

### 结构体

数组中只能定义一种类型，但是结构体中可以定义多种类型，有点类似于java中class

```go
//声明定义
type struct_variable_type struct {
   member definition;
   member definition;
   ...
   member definition;
}

type Book struct{
	author	string
	title	string
	id		int
}


func main () {
	var book Book
	book.author = "jack"
	book.title = "kk"
	book.id = 132

	fmt.Println(book)
	fmt.Println(Book{author : "lucy",title : "ll"})
}
```

结构体作为函数参数传递和普通类型用法是一样的没有区别

指向结构体的指针的用法也没什么不同

### 切片（slice）

因为go语言中数组在定义后长度是不可变的，所以需要一个灵活的动态数组，也即是切片

```go
//切片的定义不需要说明长度
var slice_1 []int
//也可以通过内置的函数make([]T,len,cap)
//len表示初始化长度，cap代表最大容量 5
var slice_1 []int = make([]int,10，50)
//也可以简写为
slice1 := make([]type, len, capacity)
//切片也可以从数组中引用获取
arr := []int{1,2,3}
slice1 := arr[:]
//表示将数组中 下标0 到 1的元素赋值给切片(左闭右开)
slice2 := arr[0:2]
slice3 := arr[0:]
slice4 := arr[:2]

```

内存布局分析

![slice](slice.png)

内置函数：

```go
//len():返回切片的长度
//cap():返回切片的容量

//现有一个切片初始化如下
testSlice := []int{0,1,2,3,4,5}
slice1 := testSlice[1:3]
//len=2 cap=6 slice=[1 2]
fmt.Printf("len=%d cap=%d slice=%v\n",len(slice1),cap(slice1),slice1)
slice2 := testSlice[2:4]
//len=2 cap=4 slice=[2 3]
fmt.Printf("len=%d cap=%d slice=%v\n",len(slice2),cap(slice2),slice2)
//如果切片中的元素来源自数组，容量就是原数组中startIndex 到数组中最后一个元素的个数

//append(slice,...):向切片中追加元素
slice2 = append(slice2,8)
//copy(targetSlice,sourceSlice)，将sourceSlice中元素赋值到targetSlice中
//如果被targetSlice容量在一开始定义时被限定，则不会被扩容，只能赋予sourceSlice中cap(targetSlice)个数的元素

```

### 关键字

#### range

作用：用于 for 循环中迭代数组(array)、切片(slice)、通道(channel)或集合(map)的元素。在数组和切片中它返回元素的索引和索引对应的值，在集合中返回 key-value 对的 key 值。

```go
 //这是我们使用range去求一个slice的和。使用数组跟这个很类似
    nums := []int{2, 3, 4}
    sum := 0
    for _, num := range nums {
        sum += num
    }
    fmt.Println("sum:", sum)
    //在数组上使用range将传入index和值两个变量。上面那个例子我们不需要使用该元素的序号，所以我们使用空白符"_"省略了。有时侯我们确实需要知道它的索引。
    for i, num := range nums {
        if num == 3 {
            fmt.Println("index:", i)
        }
    }
    //range也可以用在map的键值对上。
    kvs := map[string]string{"a": "apple", "b": "banana"}
    for k, v := range kvs {
        fmt.Printf("%s -> %s\n", k, v)
    }
    //range也可以用来枚举Unicode字符串。第一个参数是字符的索引，第二个是字符（Unicode的值）本身。
    for i, c := range "go" {
        fmt.Println(i, c)
    }
```

#### defer

延迟执行，等到周边的函数执行完之后在执行

```go
defer fmt.Println("world")
fmt.Println("hello")
//hello world

fmt.Println("counting")
for i := 0; i < 10; i++ {
  defer fmt.Print(i)
}
fmt.Println("done")
//counting
//109876543210
//done

//defer关键字延迟执行的函数都会推到栈中，再推入栈的时候传入函数的参数是参数在当时的值，并不是最终的值，余个例子
pp := 10
defer fmt.Printf("defer 修改pp之后的值为%v \n", pp)
pp += 1
fmt.Printf("修改pp之后的值为%v \n", pp)
//当语句 `fmt.Printf("defer 修改pp之后的值为%v \n", pp)` 再被推入栈中时候，pp的值是10，即使在后面语句执行时进行了修改，结果是
defer 修改pp之后的值为 10
修改pp之后的值为 11

```

注意：

​	1.defer 后面的语句只能是调用某个函数，

​	2.再推入栈的时候传入函数的参数是参数在当时的值，并不会在后续的语句中进行改变

作用：

​	类似于java中的finally{}，可以用来释放资源

### map集合

```go
//声明方式如下
/* 声明变量，默认 map 是 nil */
var map_variable map[key_data_type]value_data_type

/* 使用 make 函数 */
map_variable := make(map[key_data_type]value_data_type)

var countryCapitalMap map[string]string /*创建集合 */
    countryCapitalMap = make(map[string]string)

    /* map插入key - value对,各个国家对应的首都 */
    countryCapitalMap [ "France" ] = "Paris"
    countryCapitalMap [ "Italy" ] = "罗马"
    countryCapitalMap [ "Japan" ] = "东京"
    countryCapitalMap [ "India " ] = "新德里"

    /*使用键输出地图值 */ for country := range countryCapitalMap {
        fmt.Println(country, "首都是", countryCapitalMap [country])
    }

    /*查看元素在集合中是否存在 */
    captial, ok := countryCapitalMap [ "美国" ] /*如果确定是真实的,则存在,否则不存在 */
 
    if (ok) {
        fmt.Println("美国的首都是", captial)
    } else {
        fmt.Println("美国的首都不存在")
    }
//删除元素
delete(countryCapitalMap [ "美国" ] )
```

### 接口

```go
type Phone interface{
	call()
}

type NokiaPhone struct{

}

type IPhone struct{
}

func (nokiaPhone NokiaPhone) call(){
	fmt.Println("im nokia phone")
}
func (iphone IPhone) call(){
	fmt.Println("im iphone")
}

func main() {
	var phone Phone
	
	phone = new(NokiaPhone)
	phone.call()
	
	phone = new(IPhone)
	phone.call()
	
}
```

#### 强大的空接口

go语言中 可以定义一个空接口，此时作用相当于java中T泛型，c中void*

```go
func main() {
	var i interface{}
	describe(i)

	i = 42
	describe(i)

	i = "hello"
	describe(i)
}

func describe(i interface{}) {
	fmt.Printf("(%v, %T)\n", i, i)
}
```

类型推断：

```go
func do(i interface{}) {
	switch v := i.(type) {
	case int:
		fmt.Printf("Twice %v is %v\n", v, v*2)
	case string:
		fmt.Printf("%q is %v bytes long\n", v, len(v))
	default:
		fmt.Printf("I don't know about type %T!\n", v)
	}
}

func main() {
	do(21)
	do("hello")
	do(true)
}
```



### 错误类型

go语言定义了一个错误接口

```go
type error interface {
    Error() string
}
//当我们函数有可能存在错误时，类似于java中的抛出异常，也就是将error类型的数据作为返回值
func Sqrt(f float64) (float64, error) {
    if f < 0 {
      //手动调用
        return 0, errors.New("math: square root of negative number")
    }
    // 实现
}

//声明一个实现接口的结构体
type SqrtError struct{
	value float64
}
//实现方法
func (sqrtError SqrtError) Error() string{
	return fmt.Sprintf("输入有误 %v",sqrtError.value)
}

func main() {
	
	result,errorMsg := Sqrt(-1)
	if errorMsg != "" {
		fmt.Println(errorMsg)
	}else{
		fmt.Println(result)
	}
}

func Sqrt(f float64) (float64, string) {
    if f < 0 {
		sqrtError := new(SqrtError)
		sqrtError.value = f
		
        return 0, sqrtError.Error()
    }
    return f,""
}

```

#### 异常的处理机制

​	GO语言中可以使用defer+recover来捕获异常

```go
func testTry(){
  defer func(){
    error := recover()
    if (error != null){
      fmt.Println("捕获到异常")
    }
  }()
}
```



## 包的引用

go语言是以包（package）管理项目，

注意事项：

​	一个文件夹下包下