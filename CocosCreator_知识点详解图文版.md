# Cocos Creator 3.8 图文进阶知识点（合并版）

更新时间：2026-04-02  
目标：把两套教程的交叉内容合并为一套可执行知识体系，并补上代码示例与图示。  
来源：  
- https://www.bilibili.com/video/BV1xsLoz4Ebv/  
- https://www.bilibili.com/video/BV14i4y1o7YF/  
- https://docs.cocos.com/creator/3.8/manual/zh/

## 1. 合并后的知识图谱

![Lifecycle Flow](./images/cc-lifecycle.svg)

![Coordinate Flow](./images/cc-coordinates.svg)

![Asset Flow](./images/cc-asset-flow.svg)

![Collision Flow](./images/cc-collision-flow.svg)

## 2. 重叠内容合并说明（两个教程交叉点）

| 合并主题 | BV1xsLoz4Ebv 侧重点 | BV14i4y1o7YF 侧重点 | 最终统一结论 |
|---|---|---|---|
| 生命周期与帧更新 | 实战里讲移动、帧补偿 | 系统讲 onLoad/start/update | 初始化、运行、释放要分层，移动必须乘 `dt` |
| 坐标与向量 | 世界/本地坐标转换 | 锚点、坐标、向量计算 | 输入到目标点必须经过坐标转换，方向用向量归一化 |
| 资源与预制体 | 做项目时动态创建箭矢 | 资源动态加载、场景管理 | 资源加载要分 `预加载/动态加载/释放` 三段 |
| 事件与输入 | 按钮、碰撞触发流程 | 键鼠触摸与自定义事件 | 输入系统 + 业务事件系统要分开管理 |
| 物理与碰撞 | 3D 障碍碰撞与空气墙 | 2D/3D 物理、射线 | Trigger 做逻辑，Collision 做物理反应，Raycast 做检测 |
| 动画与音频 | 简单按钮动画和音效 | 动画系统与事件更完整 | 动画/音频都应接入状态机或统一播放入口 |
| 存储与网络 | 项目中较轻 | JSON/HTTP/Socket | 单机逻辑先抽象数据层，再上网络同步层 |

## 3. 引擎核心模块详解（说明 + 示例）

## 3.1 生命周期、调度器、帧时间补偿（已合并）

核心说明：  
- `onLoad`：获取组件引用、注册一次性依赖。  
- `start`：初始化运行态数据（计分、速度、状态）。  
- `update(dt)`：每帧逻辑，运动必须用 `dt`。  
- `onDisable/onDestroy`：取消事件与计时器，防内存泄漏。  

示例（赛车移动 + 定时器 + 安全释放）：

```ts
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CarController")
export class CarController extends Component {
  @property(Node) cameraFollow: Node | null = null;
  @property speedZ = 12;
  @property speedX = 6;

  private dirX = 0;
  private readonly temp = new Vec3();

  onLoad() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  start() {
    this.schedule(this.logHeartbeat, 2); // 每 2 秒一次
  }

  update(dt: number) {
    this.temp.set(this.dirX * this.speedX * dt, 0, this.speedZ * dt);
    this.node.translate(this.temp);

    if (this.cameraFollow) {
      const p = this.node.worldPosition;
      this.cameraFollow.setWorldPosition(p.x, this.cameraFollow.worldPosition.y, p.z - 8);
    }
  }

  onDisable() {
    this.unschedule(this.logHeartbeat);
  }

  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  private onKeyDown(e: EventKeyboard) {
    if (e.keyCode === KeyCode.KEY_A) this.dirX = -1;
    if (e.keyCode === KeyCode.KEY_D) this.dirX = 1;
  }

  private onKeyUp(e: EventKeyboard) {
    if (e.keyCode === KeyCode.KEY_A || e.keyCode === KeyCode.KEY_D) this.dirX = 0;
  }

  private logHeartbeat() {
    console.log("Car alive:", this.node.position.clone());
  }
}
```

常见误区：  
- 误把所有初始化写在构造函数。  
- 位移没乘 `dt`，高帧率设备跑更快。  
- `onDestroy` 不解绑监听，切场景后仍触发回调。  

## 3.2 坐标系、锚点、向量与移动（已合并）

核心说明：  
- UI 触摸点通常先在屏幕坐标，需要转换到世界或目标节点本地坐标。  
- 向量归一化后用于“方向”，长度用于“距离”。  
- 锚点影响的是“节点内部参考原点”，不是世界坐标原点。  

示例（让箭矢朝目标点平滑飞行）：

```ts
import { _decorator, Component, Vec3 } from "cc";
const { ccclass } = _decorator;

@ccclass("ArrowMove")
export class ArrowMove extends Component {
  private target = new Vec3();
  private speed = 700;
  private moving = false;
  private dir = new Vec3();
  private offset = new Vec3();

  flyTo(worldTarget: Vec3) {
    this.target.set(worldTarget);
    this.moving = true;
  }

  update(dt: number) {
    if (!this.moving) return;
    Vec3.subtract(this.offset, this.target, this.node.worldPosition);
    const remain = this.offset.length();
    if (remain < 3) {
      this.node.setWorldPosition(this.target);
      this.moving = false;
      return;
    }
    this.dir.set(this.offset).normalize();
    this.node.setWorldPosition(
      this.node.worldPosition.x + this.dir.x * this.speed * dt,
      this.node.worldPosition.y + this.dir.y * this.speed * dt,
      this.node.worldPosition.z + this.dir.z * this.speed * dt
    );
  }
}
```

常见误区：  
- 直接拿本地坐标和世界坐标做差。  
- 未归一化方向向量导致速度随距离变化。  
- 锚点改了后碰撞区域与视觉中心不一致。  

## 3.3 事件系统、输入系统、UI 流程（已合并）

核心说明：  
- 输入事件是“设备层”（键盘、鼠标、触摸）。  
- 自定义事件是“业务层”（开始游戏、得分、失败）。  
- UI 按钮只发业务意图，业务逻辑不要散落在按钮回调里。  

示例（简化事件总线）：

```ts
import { EventTarget } from "cc";

export const GameBus = new EventTarget();

export const EV = {
  GameStart: "game-start",
  GameOver: "game-over",
  ScoreAdd: "score-add"
} as const;
```

```ts
// Button 脚本里
import { _decorator, Component } from "cc";
import { GameBus, EV } from "./GameBus";
const { ccclass } = _decorator;

@ccclass("StartButton")
export class StartButton extends Component {
  onClickStart() {
    GameBus.emit(EV.GameStart);
  }
}
```

```ts
// GameManager
import { _decorator, Component } from "cc";
import { GameBus, EV } from "./GameBus";
const { ccclass } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  onEnable() {
    GameBus.on(EV.GameStart, this.onGameStart, this);
  }
  onDisable() {
    GameBus.off(EV.GameStart, this.onGameStart, this);
  }
  private onGameStart() {
    console.log("Game Start");
  }
}
```

常见误区：  
- 把 UI 文本更新、状态切换、音效播放都写在按钮里。  
- 场景切换后忘记 `off` 事件。  

## 3.4 资源管理、预制体、Bundle、内存释放（已合并）

核心说明：  
- 资源分三层：常驻资源、场景资源、临时资源。  
- 优先预加载高频资源，低频资源动态加载。  
- UI 关闭时释放临时资源；场景切换时回收场景资源。  

示例（Bundle 中加载预制体并实例化）：

```ts
import { _decorator, Component, assetManager, Prefab, instantiate, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SpawnFromBundle")
export class SpawnFromBundle extends Component {
  @property(Node) root: Node | null = null;

  async spawnEnemy() {
    const bundle = await new Promise<ReturnType<typeof assetManager.getBundle>>((resolve, reject) => {
      assetManager.loadBundle("battle", (err, b) => (err || !b ? reject(err) : resolve(b)));
    });

    const prefab = await new Promise<Prefab>((resolve, reject) => {
      bundle.load("prefabs/enemy", Prefab, (err, p) => (err || !p ? reject(err) : resolve(p)));
    });

    const node = instantiate(prefab);
    this.root?.addChild(node);
  }
}
```

常见误区：  
- 所有资源都 `resources.load`，包体越来越大。  
- 只加载不释放，长时游玩内存爬升。  
- 多处重复加载同一资源且无缓存策略。  

## 3.5 碰撞、物理、射线（已合并）

核心说明：  
- Trigger：重叠检测，通常不产生物理反弹。  
- Collision：有物理响应。  
- Raycast：用于命中检测、前方探测、选中对象。  

示例（触发区得分）：

```ts
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact } from "cc";
const { ccclass } = _decorator;

@ccclass("ScoreTrigger")
export class ScoreTrigger extends Component {
  onLoad() {
    const c = this.getComponent(Collider2D);
    c?.on(Contact2DType.BEGIN_CONTACT, this.onBegin, this);
  }

  onDestroy() {
    const c = this.getComponent(Collider2D);
    c?.off(Contact2DType.BEGIN_CONTACT, this.onBegin, this);
  }

  private onBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
    if (other.node.name === "Arrow") {
      console.log("score +1");
    }
  }
}
```

常见误区：  
- 需要物理碰撞却使用纯 Trigger。  
- 碰撞分组矩阵未配置，导致事件不触发。  
- 高速物体未开连续碰撞检测（CCD）造成穿透。  

## 3.6 动画、音频、UI 状态切换（已合并）

核心说明：  
- 动画状态切换建议统一入口，不要多脚本抢着播。  
- 音效分层：UI 音效、环境音、战斗音。  
- 按钮状态切换要和逻辑状态同步（可点击/不可点击）。  

示例（统一播放音效）：

```ts
import { _decorator, Component, AudioSource } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioBus")
export class AudioBus extends Component {
  @property(AudioSource) uiClick: AudioSource | null = null;
  @property(AudioSource) success: AudioSource | null = null;

  playUIClick() {
    this.uiClick?.playOneShot(this.uiClick.clip, 1);
  }

  playSuccess() {
    this.success?.playOneShot(this.success.clip, 1);
  }
}
```

常见误区：  
- 每个按钮都挂一个 `AudioSource`，音频节点爆炸。  
- 动画结束事件没清理，重复绑定。  

## 3.7 数据存储、JSON、HTTP、Socket（已合并）

核心说明：  
- 本地存储用于设置和离线进度。  
- HTTP 适合配置拉取、结算上报。  
- Socket 适合实时对战、实时房间同步。  

示例（本地存档 + 网络上报接口留口）：

```ts
type SaveData = {
  bestScore: number;
  soundOn: boolean;
};

const SAVE_KEY = "cocos.save.v1";

export function loadSave(): SaveData {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return { bestScore: 0, soundOn: true };
  try {
    return JSON.parse(raw) as SaveData;
  } catch {
    return { bestScore: 0, soundOn: true };
  }
}

export function saveScore(score: number) {
  const data = loadSave();
  data.bestScore = Math.max(data.bestScore, score);
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
```

常见误区：  
- 业务层直接散落调用 `localStorage`，后期难迁移。  
- Socket 断线重连与心跳机制缺失。  

## 4. JS 与 TS 必会知识点（引擎关联版）

## 4.1 JavaScript（重点）

1. 作用域、闭包、`this`  
- 事件回调中 `this` 丢失最常见。  

```js
node.on("click", this.onClick, this); // 传 this，避免上下文丢失
```

2. 异步编程（Promise / async-await）  
- 资源加载、网络请求都要处理失败路径。  

```js
try {
  const data = await fetch(url).then(r => r.json());
} catch (e) {
  // fallback
}
```

3. 模块化与解耦  
- UI、战斗、资源管理分模块，避免“全局脚本地狱”。  

## 4.2 TypeScript（重点）

1. 类型建模：`type` / `interface`  
- 给游戏状态、网络包、配置表建类型。  

2. 泛型  
- 做对象池、配置读取器、事件总线很实用。  

3. 装饰器  
- `@ccclass` 和 `@property` 是编辑器和代码的桥梁。  

示例（类型安全的配置读取）：

```ts
type EnemyCfg = { id: number; hp: number; speed: number };

class CfgRepo {
  private map = new Map<number, EnemyCfg>();
  getById(id: number): EnemyCfg | undefined {
    return this.map.get(id);
  }
}
```

## 5. 实战路线（从会做 -> 做稳 -> 可发布）

1. 阶段 A：可运行  
- 跟做 3D 赛车 + 2D 箭靶，完整跑通流程。  

2. 阶段 B：可维护  
- 引入事件总线、资源分层、统一音频入口。  

3. 阶段 C：可发布  
- 接入存档、配置、网络上报，做 H5 / 微信包。  

## 6. 网站一条龙工作流（你当前这套）

![Website Workflow](./images/web-workflow.svg)

当前工程已经落地：  
- 内容：`content/knowledge.md`  
- 页面结构：`src/template.html`  
- 样式：`src/styles.css`  
- 构建：`scripts/build.mjs`  
- 预览：`npm run preview`  
- 部署：Vercel（连接 GitHub 后自动同步）  

推荐日常命令：  

```bash
cd F:\learncocos\cocos-knowledge-site
npm run build
npm run preview
```

当你改完内容并推送 GitHub 后，Vercel 会自动重新部署。
