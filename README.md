# lerna-lite 轻量化 monorepo 管理利器
## 写作背景
微前端是一个新旧项结合挺常见的一种技术，我司也成功借助京东前端团队推出的 `micro-app` 完成了一主两从 **3** 个独立项目的完美结合。但随着项目整体 **sass** 化逐步转型开始，迭代差异化增加就，相对应的造成了项目依赖安装、启动、编译等一系列事项的频率变高，解决这个拖慢研发节奏的问题我想到的方案就是引入 **Monorepo** 单仓库的管理。

## **lerna-lite 介绍**
**lerna-lite** 是用来管理和发布同一仓库多 `JavaScript`/`TypeScript` 包的一款工具，与 **lerna** 相比 **lerna-lite** 具有更轻量化和模块化的特点，同时 **lerna-lite** 也是 **lerna** 的一个有限子集。我们在实际项目中可以采用渐进式的方式按需安装使用。需要注意的一点是 **lerna-lite** 是不包括 `bootstrap`、`add`、`create` 和 `link` 命令的，所以需要正式使用 **lerna-lite** 之前配置好项目的包管理器（`npm`、`pnpm`、`yarn`）。

### 快速开始：
首先要将`@lerna-lite/cli`作为开发依赖安装到项目中：
```bash
# 创建一个空项目
mkdir lerna-repo
cd lerna-repo
npm init -y

# 安装 cli 依赖并执行 init 命令
npm install -D @lerna-lite/cli
node_modules/.bin/lerna init
```

执行 `init` 命令初始化工作空间，得到一个 `lerna.json` 配置文件和一个 `packages` 文件夹；
```bash
lerna-repo            
├─ packages       
├─ lerna.json
└─ package.json
```
如果你不打算使用 `npm` 作为项目的包管理器的话需要更新 `lerna.json` 配置文件中的 `npmClient`；

1. 使用 `yarn` 配置：`"npmClient": "yarn"`
2. 使用 `pnpm` 配置：`"npmClient": "pnpm"`
### 命令列表：
| 命令 | 安装 | 介绍 |
| --- | --- | --- |
| ☁️ publish | `npm i -D @lerna-lite/publish` | 发布软件包 |
| 📑 version | `npm i -D @lerna-lite/version` | 为软件包创建新版本 |
| 🕜 changed | `npm i -D @lerna-lite/changed` | 查看上一个版本发布以来更改的软件包 |
| 🌓 diff | `npm i -D @lerna-lite/diff` | 查看上一个版本发布以来软件包发生的变化 |
| 👷 exec | `npm i -D @lerna-lite/exec` | 运行 shell 命令 |
| 📖 list | `npm i -D @lerna-lite/list` | 列出工作区中的所有本地软件包 |
| 🏃 run | `npm i -D @lerna-lite/run` | 运行script 脚本 |
| 👓 watch | `npm i -D @lerna-lite/watch` | 监听所有软件包的变更并执行自定义命令 |

**PS**： 由于 `publish` 命令依赖于 `version` 命令，所以在安装 `@lerna-lite/publish`后即可获得这两个命令。

## 一起操练起来：
![image (1)](https://github.com/OSpoon/simple-micro-app/assets/10126623/6270f045-f752-455c-8dd8-ed1ca7d563e2)

首先会创建三个独立的前端应用，接着会使用 `micro-app` 将 **Angualr16** 的项目改造为微前端的主应用，**Vue3** + **Vite** 和 **React** + **Vite** 两个项目当做子应用接入，最后在升级为 **Monorepo** 。
**lerna-lite** 将会以渐进式的方式在整个过程中逐步引入。

### 独立前端应用（Multirepo风格）：
#### Angualr16 应用：

- 创建应用：
```bash
# 创建命令
$ npx @angular/cli@16 new angular-app
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS
```

- 分配启动端口： 修改 `start` 脚本 ，增加 `--port` 选项，指明端口号；
```json
{
  "start": "ng serve --port 10010"
}
```

- 通过路由组织页面：
```typescript
app                                
├─ pages                           
│  ├─ sub-react                    	添加 react 子应用页面
│  │  ├─ sub-react.component.css   
│  │  ├─ sub-react.component.html  
│  │  └─ sub-react.component.ts    
│  └─ sub-vue                       添加 vue 子应用页面
│     ├─ sub-vue.component.css     
│     ├─ sub-vue.component.html    
│     └─ sub-vue.component.ts      
├─ app-routing.module.ts  					添加页面对应的路由         
├─ app.component.css                
├─ app.component.html               左右布局（aside + article）
└─ app.module.ts           					添加新页面的组件声明        
```
<img width="987" alt="image" src="https://github.com/OSpoon/simple-micro-app/assets/10126623/42180591-612b-4d1b-830a-b6df93e85652">
PS：文末通过访问 Github 查看项目中的变更文件，已用注释说明；

#### Vue3 应用：

- 创建应用
```bash
# 创建命令
$ npm create vite@latest
✔ Project name: vue-app
✔ Select a framework: › Vue
✔ Select a variant: › TypeScript
```

- 分配启动端口：修改 `vite.config.ts` 配置文件，增加 `server.port` 选项，指明端口号；
```javascript
{
  server: {
    port: 10011,
  }
}
```

#### React 应用：

- 创建应用
```bash
# 创建命令
$ npm create vite@latest
✔ Project name: react-app
✔ Select a framework: › React
✔ Select a variant: › TypeScript
```

- 分配启动端口：同 **Vue3** 应用，指明端口号；
```javascript
{
  server: {
    port: 10012,
  }
}
```

### 微前端改造（MicroApp）：
> 以下针对对前端的改造全部在 **Angualr16** 主应用中进行；

#### 安装并初始化：
安装`npm i @micro-zoe/micro-app --save`；
```typescript
// main.ts
import microApp from '@micro-zoe/micro-app';

microApp.start();
```
#### 支持 WebComponent：
```typescript
// app/app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```
#### 页面嵌入子应用：
```html
<!-- vue3 + vite -->
<!-- pages/sub-vue/sub-vue.component.html -->
<micro-app name="sub-vue" url="http://localhost:10011" iframe></micro-app>

<!-- react + vite -->
<!-- pages/sub-react/sub-react.component.html -->
<micro-app name="sub-react" url="http://localhost:10012" iframe></micro-app>
```
PS：子应用使用 `vite` 作为基础框架，需要主动切换到 `iframe` 沙箱；
![2024-04-22 15 41 58](https://github.com/OSpoon/simple-micro-app/assets/10126623/09dcae4a-e702-4c44-bcf7-9fced81d38dd)


### **lerna-lite（Monorepo风格）：**
按快速开始的的流程创建 `simple-micro-app` 项目且默认使用 `npm` 包管理器，执行 `init` 命令后将独立的三个前端应用移动到对应的目录。
```
simple-micro-app       
├─ packages            
│  ├─ main-angular-app  		对应 angular-app
│  ├─ sub-react-app    			对应 react-app
│  └─ sub-vue-app      			对应 vue-app
├─ lerna.json           
└─ package.json        
```
PS：`pnpm`包管理器需要依据团队使用熟练度来进行落地。

#### 查看本地应用：

- 安装：`npm i -D @lerna-lite/list`；
- 添加脚本：
```json
{
  "scripts": {
    "list": "lerna ls -la"
  }
}
```
PS：查看包括私有的所有 `JavaScript`/`TypeScript` 包；

#### 删除 node_module：

- 安装：`npm i -D @lerna-lite/exec`；
- 添加脚本：
```json
{
  "scripts": {
    "clear": "lerna exec -- rm -rf ./node_modules"
  }
}
```
PS：一次性删除 `packages` 中每个应用的 `node_module` 文件夹；

#### 安装应用依赖：

- 添加脚本：
```json
{
  "scripts": {
    "install": "lerna exec -- npm install"
  }
}
```
PS：一次性安装 `packages` 中每个应用的依赖；

#### 启动所有应用：

- 安装：`npm i -D @lerna-lite/run`；
- 添加脚本：
```json
{
  "scripts": {
    "dev": "lerna run dev --parallel"
  }
}
```
PS：需要将 `angular16` 项目中的 `start` 脚本名修改为 `dev`，与其他两个应用保持一致的启动命令；
#### 
#### 创建新版本：

- 安装：`npm i -D @lerna-lite/version`；
- 添加脚本：
```json
{
  "scripts": {
    "version": "lerna version"
  }
}
```
PS：执行 version 脚本前需要保证所有的变更都已经提交；

- 操作过程：
```bash
$ npm run version

> simple-micro-app@1.0.0 version
> lerna version

lerna-lite notice cli v3.3.3
lerna-lite info current project version 0.0.0
lerna-lite info Assuming all packages changed
? Select a new version (currently 0.0.0) Prepatch (0.0.1-alpha.0)

Changes (3 packages):
 - angular-app: 0.0.0 => 0.0.1-alpha.0 (private)
 - react-app: 0.0.0 => 0.0.1-alpha.0 (private)
 - vue-app: 0.0.0 => 0.0.1-alpha.0 (private)

? Are you sure you want to create these versions? Yes
lerna-lite info git Pushing tags...
lerna-lite info execute Skipping releases
lerna-lite success version finished
```
#### 生成 CHANGELOG：

- 修改 version 脚本：
```json
{
  "scripts": {
    "version": "lerna version --conventional-commits --changelog-preset angular"
  }
}
```
PS：使用 angular 预设在创建新版本时生成 **CHANGELOG.md** 文件；
#### 查看变更的应用：

- 安装：`npm i -D @lerna-lite/changed`；
- 添加脚本：
```json
{
  "scripts": {
    "changed": "lerna changed --all"
  }
}
```
PS：执行 `changed` 查看距离上次发布版本所有包；

- 操作过程：
```bash
$ npm run changed

> simple-micro-app@1.0.0 changed
> lerna changed --all

lerna-lite notice cli v3.3.3
lerna-lite info Looking for changed packages since v0.0.2
angular-app (PRIVATE)
lerna-lite success found 1 package ready to publish
```

#### 查看变更的内容：

- 安装：`npm i -D @lerna-lite/diff`；
- 添加脚本：
```json
{
  "scripts": {
    "diff": "lerna diff"
  }
}
```
PS：执行 `diff` 查看距离上次发布版本所有变化的内容；

- 操作过程：
```bash
$ npm run diff

diff --git a/packages/main-angular-app/src/app/app.component.html b/packages/main-angular-app/src/app/app.component.html
 <main>
   <aside>
-    <a [routerLink]="['/sub-vue']" routerLinkActive="active">sub-vue</a>
-    <a [routerLink]="['/sub-react']" routerLinkActive="active">sub-react</a>
+    <a [routerLink]="['/sub-vue']" routerLinkActive="active">vue3</a>
+    <a [routerLink]="['/sub-react']" routerLinkActive="active">react</a>
   </aside>
   <article>
     <router-outlet></router-outlet>
~
```
## 总结：
从一开始的三个独立的前端应用通过 `micro-app` 将代码从业务的层面整合到了一起，但由于此时还是 Multirepo 风格，所以对于开发维护和管理上还是存在一定的负担，每一次的迭代、BUG 修复或提交代码都需要多次 `cd` 到项目路径，逐个执行不同的命令，通过 **lerna-lite** 将它们从代码仓库的层面继续整合将大大优化拖慢研发节奏的问题。

- **micro-app** 在不同的技术栈和不同的基础框架会有不一样的要求，更多内容可以访问 [https://github.com/micro-zoe/micro-app](https://github.com/micro-zoe/micro-app) 查看学习。
- **lerna-lite** 的 `publish` 和 `watch` 两个命名以及其他命令的更多选项可以到 [https://github.com/lerna-lite/lerna-lite](https://github.com/lerna-lite/lerna-lite) 查看学习。

PS：源码访问 [https://github.com/OSpoon/simple-micro-app](https://github.com/OSpoon/simple-micro-app) 获取；
