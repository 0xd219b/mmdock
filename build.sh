#!/bin/bash

# MMDuck Dock 打包脚本
# 用于构建和打包 Mac 应用程序

set -e  # 遇到错误立即退出

echo "🦆 MMDuck Dock 应用打包脚本"
echo "================================"

# 检查 Node.js 版本
echo "📦 检查环境..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 安装依赖
echo "📥 安装依赖..."
npm install

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist/
rm -rf release/

# 构建前端资源
echo "🏗️  构建前端资源..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 前端构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 前端构建完成"
echo "📁 构建文件:"
ls -la dist/

# 开始打包应用
echo "📦 开始打包 Mac 应用..."

# 选择打包类型
echo "请选择打包类型:"
echo "1) 仅打包 (不签名，用于开发测试)"
echo "2) 完整分发包 (DMG + ZIP)"
echo "3) 仅 DMG 包"

read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo "🔧 创建开发版本..."
        npm run pack
        ;;
    2)
        echo "📀 创建完整分发包..."
        npm run dist-mac
        ;;
    3)
        echo "💿 创建 DMG 安装包..."
        npx electron-builder --mac dmg --publish=never
        ;;
    *)
        echo "❌ 无效选择，使用默认选项 (完整分发包)"
        npm run dist-mac
        ;;
esac

# 检查打包结果
if [ -d "release" ]; then
    echo "🎉 打包完成！"
    echo "📁 输出目录: release/"
    ls -la release/
    
    # 计算文件大小
    total_size=$(du -sh release/ | cut -f1)
    echo "📏 总大小: $total_size"
    
    echo ""
    echo "🚀 安装说明:"
    echo "1. 打开 release/ 目录"
    echo "2. 双击 .dmg 文件进行安装"
    echo "3. 或解压 .zip 文件直接使用"
    echo ""
    echo "⚠️  首次运行可能需要在系统偏好设置中允许运行"
else
    echo "❌ 打包失败，release 目录不存在"
    exit 1
fi

echo "✅ 脚本执行完成"