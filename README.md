# 🦆 MMDuck Dock

<div align="center">
  <img src="https://img.shields.io/badge/Electron-27.0.0-blue?style=flat-square&logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/macOS-10.14+-blue?style=flat-square&logo=apple" alt="macOS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</div>

一个基于 Electron 的 Mac 风格浮动 Dock 应用程序，提供强大的快捷键管理和应用启动功能。支持应用程序、Shell 脚本和网址三种快捷键类型，具有现代化的界面设计和丰富的交互体验。

## ✨ 功能特性

### 🎯 核心功能
- **🖱️ 拖拽移动**: 长按 500ms 激活拖拽模式，可将 Dock 移动到屏幕任意位置
- **⚙️ 设置管理**: 独立设置窗口，支持快捷键的完整生命周期管理
- **🔄 实时同步**: 设置修改后 Dock 自动更新，无需重启应用
- **💾 数据持久化**: 配置文件自动保存，支持备份和恢复

### 🚀 快捷键类型

#### 1. 应用程序快捷键
- **可视化选择**: 点击"选择应用"按钮打开原生文件选择器
- **智能激活**: 优先激活已运行的应用，否则启动新实例
- **路径自动填充**: 选择应用后自动填充应用名称和路径
- **AppleScript 集成**: 使用 AppleScript 确保应用正确激活

#### 2. Shell 脚本快捷键
- **终端执行**: 脚本在系统默认终端中运行，支持交互式命令
- **语法高亮**: 使用 ACE 编辑器提供 Shell 语法高亮和智能补全
- **临时文件管理**: 自动创建和清理临时脚本文件
- **错误处理**: 完善的错误处理和日志记录

#### 3. 网址快捷键
- **默认浏览器**: 使用系统默认浏览器打开网址
- **URL 验证**: 输入时进行 URL 格式验证
- **快速访问**: 支持常用网站的快速启动

### 🎨 界面设计
- **macOS 原生风格**: 遵循 Apple 设计规范的界面风格
- **磁性放大效果**: Dock 图标支持 macOS 风格的放大动画
- **深色/浅色主题**: 自动跟随系统主题切换
- **响应式布局**: 适配不同屏幕尺寸和分辨率

## 📦 技术栈

### 前端技术
- **React 18**: 用户界面构建
- **Tailwind CSS**: 原子化 CSS 框架
- **Framer Motion**: 动画效果库
- **Radix UI**: 无障碍组件库
- **ACE Editor**: 代码编辑器

### 桌面技术
- **Electron 27**: 跨平台桌面应用框架
- **Node.js**: 后端运行时
- **AppleScript**: macOS 系统集成

### 构建工具
- **Webpack 5**: 模块打包器
- **Babel**: JavaScript 编译器
- **PostCSS**: CSS 处理器
- **electron-builder**: 应用打包工具

## 🚀 快速开始

### 系统要求
- **操作系统**: macOS 10.14 (Mojave) 或更高版本
- **处理器**: Intel x64 或 Apple Silicon (M1/M2/M3)
- **Node.js**: v22.16.0 或更高版本
- **内存**: 至少 4GB RAM
- **存储**: 至少 100MB 可用空间

### 开发环境安装

```bash
# 克隆项目
git clone https://github.com/your-username/mmduck-dock.git
cd mmduck-dock

# 切换到推荐的 Node.js 版本
nvm use v22.16.0

# 安装依赖
npm install
# 或使用 cnpm（推荐，国内用户）
cnpm install
```

### 开发模式运行

```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动 Electron 应用
npm start
```

### 生产环境构建

```bash
# 构建前端资源
npm run build

# 启动应用
npm start
```

## 📱 使用指南

### 初次启动
1. 启动应用后，Dock 会出现在屏幕底部中央
2. 默认包含几个预设的快捷键（Terminal、Chrome、VS Code 等）
3. 点击右侧的设置图标 ⚙️ 打开设置页面

### 基本操作

#### 移动 Dock
1. 长按 Dock 区域 500ms
2. 光标变为抓取手形时开始拖拽
3. 释放鼠标完成移动

#### 使用快捷键
- **单击图标**: 执行对应的快捷键操作
- **悬停**: 显示快捷键名称提示
- **磁性效果**: 鼠标靠近时图标会放大

### 设置管理

#### 添加新快捷键

1. **进入设置页面**
   - 点击 Dock 右侧的设置按钮 ⚙️
   - 设置窗口会以独立窗口形式打开

2. **填写基本信息**
   ```
   标题: 快捷键显示名称（如：VS Code）
   图标: 选择合适的 emoji 表情
   类型: 选择快捷键类型
   ```

3. **配置不同类型的快捷键**

   **应用程序类型**:
   ```
   点击"选择应用"按钮
   → 在文件选择器中选择 .app 文件
   → 应用路径和名称会自动填充
   ```

   **脚本类型**:
   ```
   在代码编辑器中输入 Shell 命令
   支持语法高亮和自动补全
   示例：
   - echo "Hello World"
   - open ~/Downloads
   - screencapture -i ~/Desktop/screenshot.png
   ```

   **网址类型**:
   ```
   输入完整的 URL 地址
   示例：
   - https://www.google.com
   - https://github.com
   ```

4. **保存快捷键**
   - 点击"添加"按钮保存
   - Dock 会自动刷新显示新的快捷键

#### 管理现有快捷键

**启用/禁用快捷键**:
- 在设置页面中，点击快捷键右侧的开关
- 禁用的快捷键不会在 Dock 中显示

**删除快捷键**:
- 点击快捷键右侧的删除按钮
- 确认删除后，快捷键会从 Dock 中移除

**重置配置**:
- 点击"重置为默认配置"按钮
- 将恢复到初始的预设快捷键配置

## 🔧 配置文件

### 配置文件位置
```
项目根目录/config.json
```

### 配置文件结构
```json
{
  "shortcuts": [
    {
      "id": "unique-id",
      "title": "显示名称",
      "icon": "🔧",
      "type": "application|script|url",
      "command": "执行命令或路径",
      "enabled": true
    }
  ]
}
```

### 配置字段说明
- **id**: 唯一标识符，自动生成
- **title**: 快捷键显示名称
- **icon**: 显示图标（emoji）
- **type**: 快捷键类型（application/script/url）
- **command**: 执行的命令、应用路径或网址
- **enabled**: 是否启用（true/false）

### 手动配置示例
```json
{
  "shortcuts": [
    {
      "id": "terminal",
      "title": "Terminal",
      "icon": "💻",
      "type": "application",
      "command": "Terminal",
      "enabled": true
    },
    {
      "id": "screenshot",
      "title": "Screenshot",
      "icon": "📸",
      "type": "script",
      "command": "screencapture -i ~/Desktop/screenshot.png",
      "enabled": true
    },
    {
      "id": "github",
      "title": "GitHub",
      "icon": "🐙",
      "type": "url",
      "command": "https://github.com",
      "enabled": true
    }
  ]
}
```

## 📦 打包分发

### 使用打包脚本（推荐）

```bash
# 运行交互式打包脚本
./build.sh
```

脚本提供三种打包选项：
1. **仅打包**: 创建未签名的应用包，用于开发测试
2. **完整分发包**: 创建 DMG 和 ZIP 两种格式的分发包
3. **仅 DMG 包**: 创建 DMG 磁盘映像文件

### 手动打包命令

```bash
# 仅打包应用（不创建安装包）
npm run pack

# 创建 Mac 分发包（DMG + ZIP）
npm run dist-mac

# 创建所有平台分发包
npm run dist
```

### 打包输出
```
release/
├── MMDuck Dock-1.0.0.dmg          # DMG 安装包
├── MMDuck Dock-1.0.0-mac.zip      # ZIP 压缩包
└── mac/                            # 未打包的应用目录
    └── MMDuck Dock.app
```

## 🏗️ 项目结构

```
mmduck-dock/
├── 📁 src/                         # 前端源代码
│   ├── 📁 components/              # React 组件
│   │   ├── 📄 AppleStyleDock.jsx   # 主 Dock 组件
│   │   ├── 📄 SettingsPage.jsx     # 设置页面组件
│   │   ├── 📄 SettingsModal.jsx    # 设置模态框（已弃用）
│   │   └── 📁 ui/                  # UI 基础组件
│   │       └── 📄 dock.jsx         # Dock UI 组件
│   ├── 📁 services/                # 服务层
│   │   ├── 📄 electronService.js   # Electron IPC 通信服务
│   │   └── 📄 configManager.js     # 配置管理服务
│   ├── 📁 lib/                     # 工具库
│   │   └── 📄 utils.js             # 通用工具函数
│   ├── 📁 styles/                  # 样式文件
│   │   └── 📄 globals.css          # 全局样式
│   ├── 📄 index.js                 # 主应用入口
│   └── 📄 settings.jsx             # 设置页面入口
├── 📁 public/                      # 静态资源
│   ├── 📄 index.html               # 主页面模板
│   └── 📄 settings.html            # 设置页面模板
├── 📁 dist/                        # 构建输出目录
│   ├── 📄 index.html               # 构建后的主页面
│   ├── 📄 settings.html            # 构建后的设置页面
│   ├── 📄 main.bundle.js           # 主应用 JavaScript
│   └── 📄 settings.bundle.js       # 设置页面 JavaScript
├── 📁 release/                     # 打包输出目录
├── 📁 assets/                      # 应用资源
│   ├── 🖼️ icon.icns               # 应用图标（macOS）
│   └── 🖼️ dmg-background.png      # DMG 背景图
├── 📁 node_modules/                # 依赖包
├── 📄 main.js                      # Electron 主进程
├── 📄 config.json                  # 快捷键配置文件
├── 📄 package.json                 # 项目配置和依赖
├── 📄 webpack.config.js            # Webpack 配置
├── 📄 tailwind.config.js           # Tailwind CSS 配置
├── 📄 postcss.config.js            # PostCSS 配置
├── 📄 tsconfig.json                # TypeScript 配置
├── 📄 build.sh                     # 打包脚本
└── 📄 README.md                    # 项目文档
```

### 核心文件说明

#### Electron 主进程
- **main.js**: Electron 应用的主进程文件，负责窗口管理、IPC 通信、系统集成

#### React 组件
- **AppleStyleDock.jsx**: 主 Dock 组件，实现拖拽、图标显示、事件处理
- **SettingsPage.jsx**: 设置页面组件，包含快捷键管理功能
- **dock.jsx**: 底层 Dock UI 组件，提供磁性效果和拖拽功能

#### 服务层
- **electronService.js**: 封装 Electron IPC 通信的服务类
- **configManager.js**: 配置文件的读写和管理

#### 配置文件
- **webpack.config.js**: 多页面应用的 Webpack 构建配置
- **tailwind.config.js**: Tailwind CSS 的主题和插件配置

## 🎯 高级功能

### 自定义主题
修改 `tailwind.config.js` 来自定义主题：
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 自定义颜色
      },
      animation: {
        // 自定义动画
      }
    }
  }
}
```

### 添加新的快捷键类型
1. 在 `main.js` 的 `executeCommand` 函数中添加新类型处理逻辑
2. 在 `SettingsPage.jsx` 中添加新的表单字段
3. 更新配置文件结构

### 自定义图标
1. 准备图标文件（.icns 格式，macOS）
2. 将图标放入 `assets/` 目录
3. 更新 `package.json` 中的 `build.mac.icon` 配置

## 🔍 故障排除

### 常见问题

#### 应用无法启动
```bash
# 检查 Node.js 版本
node --version

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

#### 快捷键不执行
1. 检查 `config.json` 文件格式是否正确
2. 确认快捷键的 `enabled` 字段为 `true`
3. 查看 Electron 控制台的错误信息

#### 设置页面无法打开
1. 确认 `dist/settings.html` 文件存在
2. 重新构建前端资源：`npm run build`
3. 检查 Webpack 构建是否成功

#### 应用选择器无法工作
1. 确认应用具有文件系统访问权限
2. 检查 macOS 安全设置
3. 尝试手动输入应用路径

### 调试模式
```bash
# 启动时显示开发者工具
NODE_ENV=development npm start
```

### 日志查看
- Electron 主进程日志在终端中显示
- 渲染进程日志在开发者工具的 Console 中显示

## 🤝 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 React Hooks 最佳实践
- 使用 Prettier 进行代码格式化
- 编写清晰的提交信息

### 测试
```bash
# 运行测试（如果有）
npm test

# 运行 lint 检查
npm run lint
```

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🔗 相关链接

- [Electron 官方文档](https://www.electronjs.org/docs)
- [React 官方文档](https://reactjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [electron-builder 文档](https://www.electron.build/)

## 🎉 致谢

感谢以下开源项目的启发和支持：
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [ACE Editor](https://ace.c9.io/) - 代码编辑器

---

<div align="center">
  Made with ❤️ by the Bojan & Claude Code
</div>
