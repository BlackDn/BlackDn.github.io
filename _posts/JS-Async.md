## 异步

常见场景：

1. 定时任务：setTimeout，setInterval
2. 网络请求：前端向后端请求API，图片加载等
3. 事件监听

### XMLHttpRequest

`XMLHttpRequest`一开始只是微软浏览器提供的一个接口，后来各浏览器纷纷效仿提供了这个接口，于是W3C对它进行了标准化，提出了[XMLHttpRequest标准](https://www.w3.org/TR/XMLHttpRequest/)。  
简单来说它是一个浏览器对象，允许**使用 JavaScript 发送 HTTP 请求**，并从返回结果中获取信息。  
不过，如今有更为现代的方法 `fetch`，它的出现使得 `XMLHttpRequest` 在某种程度上被弃用。  
不过不少情况下，我们仍在使用`XMLHttpRequest`，包括但不限于：

1. 历史原因：之前的代码使用了 `XMLHttpRequest` 的脚本
2. 兼容旧浏览器
3. 实现 `fetch` 目前无法做到的事情，如跟踪上传进度

**XMLHttpRequest** 有两种执行模式：**同步（synchronous）**和**异步（asynchronous）**

#### 异步请求

异步操作可以分为三步：创建对象，初始化，发送请求。  
创建`XMLHttpRequest`对象非常简单：

```js
let xhr = new XMLHttpRequest();	//创建对象
```

此时`XMLHttpRequest`的构造器没有参数，所以我们要用`open()`方法对其进行初始化  

```js
xhr.open(method, URL, [async, user, password]);	//初始化操作
```

其参数如下（`[]`表示参数可选）：

- `method`：表示请求所采用的方法（GET或POST）
- `URL`：请求的URL，可以为字符串，也可以为URL对象
- `async`：可以为`true`或`false`，表示是否为异步请求，默认为`true`
- `user`、`password`：身份验证所需的账户和密码

注意`open()`仅配置请求信息，不会建立连接，不要被它的名字误导了  最后我们通过`send()`来发送请求

```js
xhr.send([body]);	//发送请求
```

调用了`send()`之后，会建立连接并发送请求到服务器，而参数`body`则表示请求的`request body`。

这之后我们可以监听改对象以获取响应，存在三种状态：

- `load`：表示请求完成，且响应结果已成功下载
- `error`：表示无法发出请求或无效URL等错误
- `progress`：表示正在下载响应的结果

```js
xhr.onload = function() {	//当接收到响应后，将调用此函数
  alert(`Loaded: ${xhr.status} ${xhr.response}`);
};

xhr.onerror = function() { // 仅在根本无法发出请求时触发
  alert(`Network Error`);
};

xhr.onprogress = function(event) { // 定期触发
  // event.loaded —— 已经下载了多少字节
  // event.lengthComputable = true，则表示服务器发送了 Content-Length header
  // event.total —— 总字节数（如果 lengthComputable 为 true）
  alert(`Received ${event.loaded} of ${event.total}`);
};
```

可以看到，我们的响应结果也会交给XMLHttpRequest对象，其中包含很多属性，比如`xhr.status`表示响应的状态码，`xhr.statusText`表示状态码对应的消息（`200` 对应 `OK`，`404`对应`Not Found`），`xhr.response`则表示服务器的`response body`

```js
const xhr = new XMLHttpRequest();
xhr.onload = () => {
    successCallback(xhr.responseText);
};

xhr.onerror = () => {
    errorCallback(new Error(xhr.statusText));
};

xhr.open('get', url, true);
xhr.send();
```

此外，我们还可以指定超时时间`timeout`，当超出这个时间请求仍没有成功执行，则会取消请求并触发`timeout`事件

```js
xhr.timeout = 10000; // timeout 单位是 ms，所以此处为 10 秒
```

#### 同步请求

上面提到了，在 `open` 方法中将参数 `async` 设为 `false`，那么发送同步请求。

```js
let xhr = new XMLHttpRequest();
xhr.open('GET', '/article/xmlhttprequest/hello.txt', false);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch(err) { // 代替 onerror
  alert("Request failed");
}
```

虽然同步的操作看起来更简单，但是还是应该尽量少用同步请求，他们会阻塞页面内的其他JS操作，直到请求结束。如果请求时间过长，甚至会导致页面无法滚动、页面未响应等错误。



#### HTTP-header

`XMLHttpRequest` 允许发送自定义的 `header`，并且可以从响应中读取 `header`。

可以通过`setRequestHeader(name, value)`设置给定的`name`和`value`

```js
xhr.setRequestHeader('Content-Type', 'application/json');
```



#### 响应格式和状态码

通过设置`xhr.responseType`可以决定响应格式：

| 可用参数         | 对应格式                    |
| ---------------- | --------------------------- |
| `""`（默认参数） | 字符串                      |
| `"text"`         | 字符串                      |
| `"arraybuffer"`  | 二进制数据格式`ArrayBuffer` |
| `"blob"`         | 二进制数据格式`Blob`        |
| `"document"`     | XML document                |
| `"json"`         | JSON（自动解析）            |

#### readyState

`XMLHttpRequest` 的状态（state）会随着处理进度的变化而变化，我们可以通过`xhr.readyState` 来了解当前状态。所有的状态及其对应值如下：

```js
UNSENT = 0; // 初始状态
OPENED = 1; // open 被调用
HEADERS_RECEIVED = 2; // 接收到 response header
LOADING = 3; // 响应正在被加载（接收到一个数据包）
DONE = 4; // 请求完成
```

`XMLHttpRequest` 对象以 `0` → `1` → `2` → `3` → … → `3` → `4` 的顺序在它们之间转变。每当通过网络接收到一个数据包，就会重复一次状态 `3`。  
因此可以用`readystatechange`来进行监听跟踪：

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // 加载中
  }
  if (xhr.readyState == 4) {
    // 请求完成
  }
};
```

以前还没有`load/error/progress`等事件处理机制，因此人们会用`readystatechange`，不过如今它已经被前者取代了。

#### 构建Post的FormData

如果我们使用的是POST请求，我们可以用`FormData`对象来保存相关的信息  然后我们可以在`send()`方法中将`FormData`发送到服务器

```js
let formData = new FormData([form]); // 创建一个FormData对象
formData.append(name, value); // 附加一个字段
//···
xhr.open('POST', ...); //使用 POST 方法。
xhr.send(formData); //发送请求
```

举个例子，发送请求时，我们可以先用页面的`<form>`元素填充`FormData`对象，如果和还有啥缺的，可以再用`append()`方法填充

```html
<form name="person">
    <input name="first-name" value="John">
    <input name="last-name" value="Smith">
</form>

<script>
    let formData = new FormData(document.forms.person);	  // 从表单预填充 FormData
    formData.append("middle", "Lee");	  // 附加一个字段
    let xhr = new XMLHttpRequest();	  // 将其发送出去
    xhr.open("POST", "/article/xmlhttprequest/post/user");
    xhr.send(formData);
    xhr.onload = () => alert(xhr.response);
</script>
```

上面的例子是用`multipart/form-data`编码，如果我们想要用JSON，也可以先用`JSON.stringify()`构建JSON对象，然后直接作为send方法的参数发送。不过要在`header` 里声明以下式JSON类型

```js
let xhr = new XMLHttpRequest();
let json = JSON.stringify({
    name: "John",
    surname: "Smith"
});

xhr.open("POST", '/submit')
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
xhr.send(json);
```

#### 追踪上传进度

之前提到，在下载阶段的状态是`progress`。但是于POST来说，`XMLHttpRequest`会先上传数据（request body），然后再下载响应。  
因此，`xhr.onprogress`就不能跟踪上传进度，我们要转而使用`xhr.upload`。它也存在许多状态供我们监听：

- `loadstart` —— 上传开始。
- `progress` —— 上传期间定期触发。
- `abort` —— 上传中止。
- `error` —— 非 HTTP 错误。
- `load` —— 上传成功完成。
- `timeout` —— 上传超时（如果设置了 `timeout` 属性）。
- `loadend` —— 上传完成，可能成功也可能是 `error`。

举几个监听的例子：

```js
xhr.upload.onprogress = function(event) {
  alert(`Uploaded ${event.loaded} of ${event.total} bytes`);
};
xhr.upload.onload = function() {
  alert(`Upload finished successfully.`);
};
xhr.upload.onerror = function() {
  alert(`Error during the upload: ${xhr.status}`);
};
```

### Promise

```js
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.responseText);
        };
        xhr.onerror = () => {
            reject(new Error(xhr.statusText));
        };
        xhr.open('GET', url, true);
        xhr.send();
    });
}

```

### Fetch







## 参考

1. [Asynchronous Vs Synchronous Programming](https://www.youtube.com/watch?v=Kpn2ajSa92c&t=63s)
2. [REQRES](https://reqres.in/)
3. [XMLHttpRequest](https://zh.javascript.info/xmlhttprequest)
4. [Sending JavaScript Http Requests with XMLHttpRequest](https://www.youtube.com/watch?v=4K33w-0-p2c&t=407s)

