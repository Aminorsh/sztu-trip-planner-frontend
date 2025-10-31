src/
├ assets/
│   ├ images/
│   ├ icons/
│   └ styles/               # 全局 CSS /变量 /重置样式 等
│
├ components/               # 公共复用组件
│   ├ base/                  # 基础组件，如 BaseButton.vue、BaseInput.vue
│   ├ layout/                # 布局组件（Header.vue / Footer.vue / Sidebar.vue 等）
│   ├ map/                   # 地图 /路线 /标记 相关组件
│   └ …
│
├ views/                     # 各页面视图组件，对应你说的十个页面
│   ├ Home.vue                # 首页
│   ├ Auth/                    # 登录 /注册 /忘记密码 目录
│   │   ├ Login.vue
│   │   ├ Register.vue
│   │   └ ForgotPassword.vue
│   ├ Dashboard.vue            # 行程列表 / 仪表板
│   ├ TripDetail.vue           # 行程详情 / 编辑
│   ├ PlaceSearch.vue          # 地点搜索 / 添加（可作为弹窗或子视图）
│   ├ PlaceDetail.vue          # 地点详情
│   ├ ShareTrip.vue             # 分享 / 公开展示视图（只读）
│   ├ ExportPanel.vue          # 导出 / 下载界面 / 弹窗
│   ├ Notifications.vue        # 通知 / 消息页
│   └ Profile.vue              # 用户资料 / 设置页
│
├ router/
│   └ index.js                 # Vue Router 路由表（定义各视图组件对应路径）
│
├ store/                      # 前端状态管理（如 Vuex 或 Pinia）
│   ├ index.js
│   ├ user.js
│   ├ trip.js
│   └ notification.js
│
├ services/                   # 与后端 API 通信层
│   ├ apiClient.js            # axios / fetch 的通用封装
│   ├ authService.js          # 登录 /注册 /用户信息 API
│   ├ tripService.js           # 行程 / 行程项 /路线 /打卡 等 API
│   ├ placeService.js         # 地点搜索 /详情 API
│   ├ exportService.js         # 导出 /下载 API
│   └ notificationService.js   # 通知 /消息 API
│
├ composables/                # Vue 3 Composition API 可复用逻辑
│   ├ useAuth.js
│   ├ useTrip.js
│   ├ useMap.js
│   └ useNotifications.js
│
├ utils/                      # 工具 / 辅助函数（不强依赖 Vue）
│   ├ dateUtils.js
│   ├ geoUtils.js
│   └ helpers.js
│
├ App.vue                     # 根组件
└ main.js                      # 应用入口脚本（挂载 Vue /Router /Store 等）

└ package.js

└ vite-config.js


# 前端项目准备总结文档

## 一、项目概况

这是一个基于 Vue 3 + Vue Router + Pinia + axios 开发的行程规划系统前端项目。目标是实现多个页面（如首页 / 登录 /行程编辑 /地点搜索 /分享 /导出 /通知 /用户资料等），前后端通过 API 通信完成数据交互。

在编写业务逻辑之前，我已完成如下准备工作：

1. 安装基础依赖
2. 搭建项目入口 /主文件
3. 配置路由
4. 规划全局状态管理 /Store 结构
5. 搭建 API 服务 /通信层
6. 编写工具 /辅助函数
7. 编写通用 /布局 /基础组件骨架

下面是每一步的具体说明、目录结构、注意事项、下一步建议。

---

## 二、准备工作的详细总结

### 1. 基础依赖安装

* 安装了核心依赖：`vue@3`、`vue-router@4`、`axios`
* （可选）安装了状态管理库 Pinia
* （可选）安装了 ESLint / Prettier 等代码风格工具

**作用 /意义**：确保项目具备最基本的框架、路由、HTTP 通信能力。后续页面、服务、状态管理都依赖这些基础包。

---

### 2. 项目入口 /主文件搭建

* 在 `src/main.js` 中创建 Vue 应用，挂载路由、Pinia（状态管理）、全局样式
* 在 `src/App.vue` 中定义根组件，使用 `<router-view />` 作为路由视图插槽
* 在根 `index.html` 中确保有 `<div id="app"></div>` 并引入 `main.js`

**作用 /意义**：这一套是 Vue 应用的启动机制。路由、状态管理、组件渲染都是从这里生效。

---

### 3. 路由配置

* 在 `src/router/index.js` 中配置路由表
  * 路径 → 视图组件 映射
  * 使用 `createWebHistory()` 实现干净 URL
  * 对部分路径使用 `props: true` 将路由参数作为组件 props 传入

**作用 /意义**：路由决定用户输入的 URL 显示哪个视图组件，是 SPA 应用的导航基础。

---

### 4. 状态管理 / 全局 Store 结构规划

* 使用 Pinia （或 Vuex）创建全局 store 架构
* 已建立以下模块：
  * `user` 模块：存储当前用户信息 /令牌等
  * `trip` 模块：存储当前行程 /行程列表
  * `notification` 模块：存储通知 /消息列表

**作用 /意义**：跨页面 /组件共享状态（如登录信息 /当前行程 /通知）更简单、集中、可维护。避免多个组件重复做状态同步。

---

### 5. API 服务 /通信层搭建

* 创建 `services/apiClient.js`，封装 axios 实例，统一设置 base URL、请求拦截器、响应拦截器
* 在 `services/` 目录下创建各业务模块服务文件（如 `authService.js`、`tripService.js`、`placeService.js`、`exportService.js`、`notificationService.js`）
* 在服务文件中定义与后端接口对应的方法（如 `login()`, `getTrips()`, `getTripById()`, `addTripItem()` 等）

**作用 /意义**：将页面与后端通信逻辑剥离出来，页面层只调用服务方法，不关心底层请求细节。便于后期维护、错误统一处理、拦截器统一处理 token、错误、重试等。

---

### 6. 工具 /辅助函数准备

* 在 `utils/` 目录编写通用工具函数，如 `dateUtils.js`、`geoUtils.js`、`helpers.js`
* `dateUtils` 提供日期格式化、日期运算等
* `geoUtils` 提供地理计算（如两点经纬度距离计算）
* `helpers` 等通用函数（判断空对象、深拷贝、小工具等）

**作用 /意义**：把通用的逻辑与算法抽离，避免多个页面 /组件代码重复。使代码更清晰、更 DRY（Don't Repeat Yourself）。

---

### 7. 可复用组件 / 布局组件骨架编写

* 在 `components/base/` 写基础组件（如 `BaseButton.vue`）
* 在 `components/layout/` 写布局组件（如 `Header.vue`、`Footer.vue` 等）
* 未来地图 /标记 /路线等组件放在 `components/map/`
* 这些组件目前是骨架 /最基础样式，后续可增添属性 /样式 /交互

**作用 /意义**：页面中只需组合这些组件，而不是每次都重复写样式 / DOM 结构。提高开发效率与一致性。

---

## 三、当前结果 &目录结构回顾

你应该现在至少已经有如下结构与文件（非全部，但关键部分）：

<pre class="overflow-visible!" data-start="2371" data-end="3019"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>src</span><span>/
 ├ assets/...
 ├ components/
 │   ├ base/BaseButton</span><span>.vue</span><span>
 │   └ layout/</span><span>Header</span><span>.vue</span><span> / </span><span>Footer</span><span>.vue</span><span>
 ├ views/
 │   Home</span><span>.vue</span><span>, Login</span><span>.vue</span><span>, Register</span><span>.vue</span><span>, Dashboard</span><span>.vue</span><span>, TripDetail</span><span>.vue</span><span>, PlaceSearch</span><span>.vue</span><span>, PlaceDetail</span><span>.vue</span><span>, ShareTrip</span><span>.vue</span><span>, ExportPanel</span><span>.vue</span><span>, Notifications</span><span>.vue</span><span>, Profile</span><span>.vue</span><span>
 ├ router/
 │   index</span><span>.js</span><span>
 ├ store/
 │   index</span><span>.js</span><span>, user</span><span>.js</span><span>, trip</span><span>.js</span><span>, notification</span><span>.js</span><span>
 ├ services/
 │   apiClient</span><span>.js</span><span>, authService</span><span>.js</span><span>, tripService</span><span>.js</span><span>, placeService</span><span>.js</span><span>, exportService</span><span>.js</span><span>, notificationService</span><span>.js</span><span>
 ├ composables/
 │   useAuth</span><span>.js</span><span>, useTrip</span><span>.js</span><span>, useMap</span><span>.js</span><span>, useNotifications</span><span>.js</span><span> (或空骨架)
 ├ utils/
 │   dateUtils</span><span>.js</span><span>, geoUtils</span><span>.js</span><span>, helpers</span><span>.js</span><span>
 ├ App</span><span>.vue</span><span>
 └ </span><span>main</span><span>.js</span><span>
</span></span></code></div></div></pre>

页面视图组件已被占位创建，路由已经关联，好几条关键服务与状态模块已搭好骨架。

---

## 四、下一步建议 /后端对接前的准备

接下来，你可以做以下工作：

1. **接口文档 /后端对接**
   与后端一起明确每个 API 路径、请求参数、响应格式。这很关键，前端服务调用必须与后端一致。
2. **填充页面骨架 /UI 结构**
   在各 `views/` 下填入每页面的结构、基本 DOM /组件组合 /布局。
3. **路由守卫 /权限控制**
   在 Router 中加入验证逻辑（如未登录重定向登录页、访问无权限行程提示等）。
4. **页面数据获取 & 与 store /服务的交互**
   在 `beforeMount` /`onMounted` /`setup` 中调用服务获取数据，然后写入 store /局部状态。
5. **样式 / 主题 /响应式设计**
   设计各页面 /组件样式，写 CSS /SCSS /变量 /mixins，保证在不同分辨率下布局合理。
6. **错误 / loading /空状态处理**
   页面加载期间显示 loading、接口失败显示错误提示、无数据时显示空状态 UI。
7. **地图组件 /路线渲染 /打卡展示**
   对于行程详情页面，调入地图组件，展示标记 /连线 /轨迹。
8. **导出 /分享 /通知 /协作逻辑**
   依次开发导出页面、分享页面、通知模块、协作状态同步等。
9. **测试 /调试 /优化**
   不断在页面间切换、模拟错误、调试网络调用、优化性能、目录结构复查等。
