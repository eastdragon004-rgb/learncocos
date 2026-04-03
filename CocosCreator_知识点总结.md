# Cocos Creator 教程与引擎能力知识点总结

更新时间：2026-04-02  
适用版本：Cocos Creator 3.8.x（重点参考 3.8.6 附近版本）

## 1. 资料来源

- B 站教程 1（新手实战）  
  https://www.bilibili.com/video/BV1xsLoz4Ebv/
- B 站教程 2（系统化基础到实战）  
  https://www.bilibili.com/video/BV14i4y1o7YF/
- 官方文档（3.8 中文手册）  
  https://docs.cocos.com/creator/3.8/manual/zh/

## 2. 两套教程的知识点总览

### 2.1 BV1xsLoz4Ebv（2026 最新 Cocos Creator 3.8.6 新手入门实战）

课程结构偏“边做边学”，核心分为 3D 小项目 + 2D 小项目：

1. 环境与编辑器入门
- Cocos Creator 基础认知
- 环境安装与项目创建
- 项目目录结构、编辑器界面与基本操作

2. 3D 场景与对象基础
- 3D 节点创建与变换（位移/旋转/缩放）
- 摄像机与灯光调试
- 父子节点层级关系

3. 3D 实战（赛车类）
- 跑道、墙体、赛车对象搭建
- 脚本创建与生命周期
- 车辆与镜头移动、帧时间补偿
- 输入控制（左右移动）与镜头跟随策略
- 模型导入与移动范围限制
- 障碍物、碰撞组件、触发逻辑
- 失败状态、停止逻辑、空气墙限制

4. UI 与游戏流程控制
- 在 3D 项目中使用 2D UI 节点
- 节点显示/隐藏/销毁
- Label 文本控制
- Button 回调与参数传递
- 重开逻辑实现

5. 2D 实战（箭靶/射击类）
- 背景与目标创建
- 箭矢预制体与平滑移动
- 本地坐标与世界坐标转换
- 箭矢“粘附”目标效果
- 碰撞判定、成功条件、提示框
- 按钮动画与音效

6. 进阶方向（结尾章节给出）
- 倒水瓶/3D 麻将消除等专项实战入口

学习价值：非常适合新手快速建立“做得出来”的项目闭环。

### 2.2 BV14i4y1o7YF（Cocos Creator 零基础小白超神教程）

课程结构偏“先编程基础，再引擎专题，再综合实战”：

1. 编程语言与设计基础
- 变量、常量、类型、枚举、运算符
- 条件/循环/函数
- 面向对象、构造函数、静态成员
- 继承、抽象类、接口、泛型、命名空间
- 回调、访问修饰符、正则基础
- 常见设计模式：单例、观察者、工厂、代理
- 基础数据结构：链表等

2. Creator 核心能力
- 节点系统、锚点与坐标系
- 精灵与图集
- 向量与运动计算
- 脚本结构与生命周期
- 常用节点 API、预制体
- 资源动态加载、场景管理

3. 交互与系统专题
- 键鼠、触摸与自定义事件
- 碰撞检测、物理系统、射线检测
- 动作系统、动画系统、动画事件
- UI 系统：Canvas、布局、按钮、输入框、进度条等
- 屏幕适配、遮罩、图文混排

4. 数据与网络
- 本地数据存储
- JSON 数据读写
- HTTP 网络请求
- Socket 与 Node.js 服务端基础对接

5. 平台发布
- H5 打包
- 微信小游戏打包

学习价值：体系化很完整，适合补齐知识广度与工程观。  
注意：该课程发布时间较早（2021-11-30），实操时要以 3.8 官方 API 为准。

## 3. 对照官方文档的引擎核心能力清单（3.8）

### 3.1 脚本与组件（最核心）

- `Component` 开发范式
- 脚本组织、模块化导入导出
- 生命周期：`onLoad`、`onEnable`、`start`、`update`、`lateUpdate`、`onDisable`、`onDestroy`
- 定时器与调度器
- 节点与组件访问、动态创建与销毁

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/index.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/script-basics.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/life-cycle-callbacks.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/scheduler.html

### 3.2 事件与输入

- 输入事件系统（触摸/鼠标/键盘）
- 节点事件与事件派发
- 自定义事件与解耦通信

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/engine/event/index.html
- https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-input.html

### 3.3 资源管理与加载

- Asset Manager 基本模型
- 动态加载、预加载、释放资源
- Asset Bundle 分包、版本、加载策略

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-manager.html
- https://docs.cocos.com/creator/3.8/manual/zh/asset/bundle.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/load-assets.html

### 3.4 场景与流程管理

- 场景切换与加载回调
- 场景预加载
- 常驻节点（跨场景状态与参数）

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/scene-managing.html

### 3.5 UI、动画、音频、物理

- UI 组件体系（Button、Layout、ScrollView、EditBox 等）
- 动画系统（AnimationClip、曲线、事件）
- 音频系统（AudioSource）
- 2D/3D 物理、触发器、碰撞器、事件回调、射线检测

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/button.html
- https://docs.cocos.com/creator/3.8/manual/zh/animation/index.html
- https://docs.cocos.com/creator/3.8/manual/zh/audio-system/overview.html
- https://docs.cocos.com/creator/3.8/manual/zh/physics/index.html

## 4. 引擎开发需要掌握的 JavaScript 与 TypeScript 知识点

## 4.1 JavaScript 必备（实战优先）

1. 语法与运行机制
- 作用域、闭包、`this` 绑定
- 箭头函数与普通函数差异
- 原型链与类语法

2. 异步与并发
- Promise、`async/await`
- 回调与事件驱动编程
- 常见异步错误处理

3. 数据与模块
- 数组/对象/Map 常见操作
- 深浅拷贝与引用问题
- ES Modules：`import` / `export`

4. 工程实践
- 日志与调试思路
- 常见性能问题（频繁创建对象、无效 update 逻辑）

## 4.2 TypeScript 必备（Creator 3.x 强烈建议）

1. 类型系统
- 基础类型、联合类型、字面量类型
- 接口（`interface`）与类型别名（`type`）
- 可选属性、只读属性、索引签名

2. 面向对象与泛型
- 类、继承、抽象类、访问修饰符
- 泛型函数/类（提升复用能力）

3. 空值与类型收窄
- `null/undefined` 安全处理
- 类型守卫、类型断言使用边界

4. 装饰器与序列化
- `@ccclass`、`@property` 的使用
- 属性在 Inspector 的可见性与序列化规则

5. 模块与配置
- 脚本模块化组织
- `tsconfig` 常见配置理解

建议文档：
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/language-support.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/decorator.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/index.html
- https://docs.cocos.com/creator/3.8/manual/zh/scripting/tsconfig.html

## 5. 学习顺序建议（可执行版）

1. 第 1 阶段：能跑通（1-2 周）
- 跟做 BV1xsLoz4Ebv 的 3D/2D 两个小实战
- 同时补 JS 基础：函数、对象、异步、模块

2. 第 2 阶段：补体系（2-4 周）
- 按 BV14i4y1o7YF 的专题补齐：事件、资源、场景、UI、物理、网络
- 每学一章就用 3.8 文档核对 API

3. 第 3 阶段：工程化（持续）
- 用 TypeScript 规范化项目结构
- 建立统一资源加载与释放策略
- 建立事件总线/状态管理与调试工具
- 做一个完整可发布小游戏（含登录、音效、存档、打包）

## 6. 最终目标检查清单

- 能独立搭建一个 2D/3D 小游戏主循环
- 能正确处理输入、碰撞、动画、音频与 UI 流程
- 能写清晰的 TS 组件并完成模块化组织
- 能做资源分包、动态加载与内存释放
- 能完成 H5/微信小游戏打包与基本问题排查
