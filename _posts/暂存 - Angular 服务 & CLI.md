
https://xie.infoq.cn/article/7baec545b8202471064494a69


## CLI 和 自带库

Angular 自带一套 CLI 工具（命令行工具），能简化许多任务，常用的命令如下：  

| 命令          | 作用                                   |
| ------------- | -------------------------------------- |
| `ng build`    | 编译 Angualr 项目输出到指定目录        |
| `ng serve`    | 构建并运行项目，文件变化后自动重新构建 |
| `ng generate` | 生成对应文件                           |
| `ng test`     | 运行单元测试                           |
| `ng e2e`      | 编译并运行项目，且运行端到端测试       |

一两句话解释起来有些云里雾里的，但是这些命令在某些时候确实挺方便的。如果我们想要新建一个组件，通常会有`.ts`，`.html`，`.css` 这些当前组件对应的文件，更别说还可能会有`.spec`测试文件等，自己一个个创建十分麻烦。  
这时候可以使用命令 `ng generate component my-component`，这个时候 Angular 会在当前目录下创建一个文件夹，其中就包含了上述的所有文件，就不需要自己一个个新建了，十分方便。

**Angular** 有很多自带库来实现一些常见的功能，比如路由、表单、请求、动画等。

| 库                     | 作用                                                           |
| ---------------------- | -------------------------------------------------------------- |
| **Angular Router**     | 提供路由机制和导航功能，支持懒加载、嵌套路由、自定义路径匹配等 |
| **Angular Forms**      | 表单填写和输入验证                                             |
| **Angular HttpClient** | 客户端 - 服务器通信                                            |
| **Angular Animations** | 动画                                                           |
| **Angular PWA**        | 用于构建渐进式 Web 应用（Progressive Web App）                 |
| **Angular Schematics** | 一系列部署、重构、升级的自动化工具                             |


## 服务

**服务（Service）** 常用于在多个组件之间共用一段逻辑，比如共享一个全局的属性、数据或操作。可以简单理解成一个全局的工具  
服务以  `service`  作为后缀（如  `my-custom-serv.service.ts` ），用 `@Injectable` 标识，其中需要有一个 `providedIn` 属性，用于定义哪些组件可以使用该服务，比如 `root` 表示任何组件都可以访问服务。  
我们整一个计算两数之和的服务：

```typescript
<!-- sum.service.ts -->
@Injectable({
  providedIn: 'root',
})
class SumService {
  sum(x: number, y: number) { return x + y; }
}
```

在调用的时候，通过 `inject()` 方法获得一个服务的对象，就可以直接调用服务里的方法了：

```typescript
// hello-world.component.ts
@Component({ ... })
export class HelloWorld {
	private sumService = inject(SumService);
	total = this.SumService.sum(50, 25);
}
```


### 父子组件通过服务通讯

这个稍微复杂一些，我们先假定一个情景：实现一个学生签到的功能。  
首先，我们有一个子组件类`Student`，用于表示学生：

```typescript
// student.component.ts
@Component({
  selector: "app-student",
  template: `
    <div>
      <p>Hello, I'm {{ name }}</p>
    </div>
  `,
})
export class StudentComponent {
  @Input() name = "";
}
```

有个父组件包含学生名单 `students`，和一个签到表 `signPaper`。  
在**模板**中遍历 `students` 来生成**Student 组件**，最后遍历 `signPaper` 来生成签到记录，当然现在是空的。

```typescript
// father.component.ts
@Component({
  selector: "app-father",
  template: `
    <div class="container">
      <app-student *ngFor="let student of students" [name]="student"></app-student>

      <ul>
        <li *ngFor="let signedStudent of signPaper">
          {{ signedStudent }}
        </li>
      </ul>
    </div>
  `,
})
export class FatherComponent {
  students = ["Mike", "Alice", "Black"];
  signPaper: string[] = [];
}
```

然后我们可以开始写服务了，新建文件`sign.service.ts`，或者通过`ng generate service Sign`自动创建（会自动加上`Service`后缀，我们不用加）

```typescript
// sign.service.ts
@Injectable({
  providedIn: "root",
})
export class SignService {
  private signedSource = new Subject<string>();
  signed = this.signedSource.asObservable();
  sign(student: string) {
    this.signedSource.next(student);
  }
}
```

在文件中，我们有一个 `signedSource` 用来保存数据，不过它是私有的，通过`asObservable()`方法将其以订阅的方式暴露给外界，同时定义一个方法`sign`，用于接收外面的数据并保存到 `signedSource`中。

```typescript
// fater.component.ts
@Component({
  //...
  providers: [SignService],
})
export class FatherComponent {
  students = ["Mike", "Alice", "Black"];
  signPaper: string[] = [];

  constructor(private signService: SignService) {
    signService.signed.subscribe((student) => {
      this.signPaper.push(`${student} has signed!`);
    });
  }
}
```

在父组件中，我们在**装饰器**中先用`providers`声明导入的服务，这里是`SignService`。然后在**构造方法**中得到这个服务的实例对象，并对`SignService`中的 `signed` 对象进行订阅，将其中所有学生姓名取出，放入父组件自身的 `signPaper` 中。

然后来到子组件，首先我们在子组件的构造方法中将`SignService`对象注入，不过因为结构比较简单，构造方法中没啥要做的。  
然后创建一个`sign()`方法作为按钮的点击事件，给每个子组件调用，它将每个子组件的名字属性 `name` 传给服务对象的`sign()`方法。即每个学生点击按钮签到后，将学生的名字存入服务的`signedSource`。

```typescript
// student.component.ts
@Component({
  //...
  template: `
    <div>
      <p>Hello, I'm {{ name }}</p>
      <button (click)="sign()">Sign</button>
    </div>
  `,
})
export class StudentComponent {
  @Input() name = "";

  constructor(private signService: SignService) {}
  sign() {
    this.signService.sign(this.name);
  }
}
```

到此为止，我们的子组件和父组件通过服务的通讯就实现了，我们的这个服务就像是一个存储数据的中间人，父子组件没有直接通讯，两者都和这个服务直接交流。  
一开始服务的`signedSource`是空的，当我们点击子组件的按钮，子组件通过调用服务的`sign()`方法，将数据存入服务的`signedSource`中；然后父组件以`signedSource`为数据源，将其中数据放入自己的`signPaper`中，最后根据`signPaper`中的数据进行渲染。

```
子组件 --(点击签到按钮，调用sign()方法)-->
服务(signedSource) --(获取数据，存入signPaper)--> 父组件渲染
```
