const { app, BrowserWindow, screen, globalShortcut, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const ConfigManager = require('./src/services/configManager');

let mainWindow;
let settingsWindow;
let configManager;

function createWindow() {
  // 获取主显示器尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 140,
    x: Math.round((width - 600) / 2), // 居中显示
    y: height - 160, // 底部位置
    frame: false, // 无边框
    transparent: true, // 透明背景
    alwaysOnTop: true, // 始终在顶部
    skipTaskbar: true, // 不显示在任务栏
    resizable: false, // 不可调整大小
    movable: true, // 允许移动
    minimizable: false, // 不可最小化
    maximizable: false, // 不可最大化
    closable: true, // 可关闭
    focusable: true, // 可聚焦
    show: false, // 初始时不显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    }
  });

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // 当窗口准备好时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 设置窗口级别
  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);
  
  // 防止窗口失去焦点时隐藏
  mainWindow.setFullScreenable(false);
  
  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 监听窗口失去焦点事件
  mainWindow.on('blur', () => {
    // 可以选择在失去焦点时隐藏窗口
    // mainWindow.hide();
  });

  // 防止窗口被最小化
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
  });

  // 开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// 创建设置窗口
function createSettingsWindow() {
  console.log('🔧 正在创建设置窗口...');
  if (settingsWindow) {
    console.log('🔧 设置窗口已存在，聚焦...');
    settingsWindow.focus();
    return;
  }

  // 获取主显示器尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  settingsWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    x: Math.round((width - 1200) / 2), // 居中显示
    y: Math.round((height - 800) / 2), // 垂直居中
    frame: true, // 有边框
    transparent: false, // 不透明
    alwaysOnTop: false, // 不要始终在顶部
    skipTaskbar: false, // 显示在任务栏
    resizable: true, // 可调整大小
    movable: true, // 允许移动
    minimizable: true, // 可最小化
    maximizable: true, // 可最大化
    closable: true, // 可关闭
    focusable: true, // 可聚焦
    show: false, // 初始时不显示
    title: '快捷键设置',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    }
  });

  // 加载设置页面
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 加载开发环境设置页面: http://localhost:3000/settings.html');
    settingsWindow.loadURL('http://localhost:3000/settings.html');
  } else {
    console.log('🔧 加载生产环境设置页面');
    settingsWindow.loadFile(path.join(__dirname, 'dist/settings.html'));
  }

  // 当窗口准备好时显示
  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show();
  });

  // 监听窗口关闭事件
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  // 开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    settingsWindow.webContents.openDevTools();
  }
}

// 执行脚本或命令
function executeCommand(command, type = 'application') {
  return new Promise((resolve, reject) => {
    if (type === 'url') {
      // 如果是URL，使用shell打开
      shell.openExternal(command)
        .then(() => resolve({ success: true, message: '成功打开URL' }))
        .catch(err => reject({ success: false, error: err.message }));
      return;
    }

    if (type === 'application') {
      // 对于应用程序，使用AppleScript来激活或启动
      const appleScript = `
        tell application "System Events"
          if (name of processes) contains "${command}" then
            tell application "${command}" to activate
          else
            tell application "${command}" to activate
          end if
        end tell
      `;
      
      exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
        if (error) {
          console.error(`应用程序激活错误: ${error}`);
          // 如果AppleScript失败，尝试使用open命令
          exec(`open -a "${command}"`, (fallbackError, fallbackStdout, fallbackStderr) => {
            if (fallbackError) {
              reject({ success: false, error: `无法启动应用程序: ${command}` });
            } else {
              resolve({ success: true, message: `成功启动应用程序: ${command}` });
            }
          });
          return;
        }
        
        resolve({ 
          success: true, 
          message: `成功激活应用程序: ${command}`,
          stdout: stdout.trim()
        });
      });
      return;
    }

    // 对于脚本命令，在终端中执行
    if (type === 'script') {
      // 创建临时脚本文件
      const tmpDir = require('os').tmpdir();
      const scriptPath = path.join(tmpDir, `mmduck_script_${Date.now()}.sh`);
      
      try {
        // 写入脚本内容
        require('fs').writeFileSync(scriptPath, command, { mode: 0o755 });
        
        // 使用AppleScript在Terminal中执行脚本
        const appleScript = `
          tell application "Terminal"
            activate
            do script "chmod +x '${scriptPath}' && '${scriptPath}' && rm -f '${scriptPath}'"
          end tell
        `;
        
        exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
          if (error) {
            console.error(`终端执行错误: ${error}`);
            // 清理临时文件
            try {
              require('fs').unlinkSync(scriptPath);
            } catch (cleanupError) {
              console.warn(`清理临时文件失败: ${cleanupError}`);
            }
            reject({ success: false, error: `无法在终端中执行脚本: ${error.message}` });
            return;
          }
          
          resolve({ 
            success: true, 
            message: '脚本已在终端中执行',
            stdout: stdout.trim()
          });
        });
      } catch (writeError) {
        console.error(`写入脚本文件错误: ${writeError}`);
        reject({ success: false, error: `无法创建临时脚本文件: ${writeError.message}` });
      }
      return;
    }

    // 对于其他命令，直接执行
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        reject({ success: false, error: error.message });
        return;
      }
      
      if (stderr) {
        console.warn(`警告: ${stderr}`);
      }
      
      resolve({ 
        success: true, 
        message: '命令执行成功',
        stdout: stdout.trim(),
        stderr: stderr.trim() 
      });
    });
  });
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(() => {
  // 初始化配置管理器
  configManager = new ConfigManager();
  
  createWindow();

  // 注册全局快捷键来显示/隐藏窗口
  globalShortcut.register('Command+Space', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });

  // 监听窗口位置变化
  ipcMain.on('move-window', (event, { x, y }) => {
    if (mainWindow) {
      const [currentX, currentY] = mainWindow.getPosition();
      mainWindow.setPosition(currentX + x, currentY + y);
    }
  });

  // 获取快捷键配置
  ipcMain.handle('get-shortcuts', () => {
    return configManager.getShortcuts();
  });

  // 获取所有快捷键配置（包括禁用的）
  ipcMain.handle('get-all-shortcuts', () => {
    return configManager.getAllShortcuts();
  });

  // 执行快捷键命令
  ipcMain.handle('execute-shortcut', async (event, id) => {
    const shortcut = configManager.getShortcut(id);
    if (!shortcut) {
      return { success: false, error: '快捷键不存在' };
    }

    try {
      const result = await executeCommand(shortcut.command, shortcut.type);
      return result;
    } catch (error) {
      return error;
    }
  });

  // 添加快捷键
  ipcMain.handle('add-shortcut', (event, shortcut) => {
    return configManager.addShortcut(shortcut);
  });

  // 更新快捷键
  ipcMain.handle('update-shortcut', (event, id, updates) => {
    return configManager.updateShortcut(id, updates);
  });

  // 删除快捷键
  ipcMain.handle('delete-shortcut', (event, id) => {
    return configManager.deleteShortcut(id);
  });

  // 切换快捷键启用状态
  ipcMain.handle('toggle-shortcut', (event, id) => {
    return configManager.toggleShortcut(id);
  });

  // 重置为默认配置
  ipcMain.handle('reset-config', () => {
    return configManager.resetToDefault();
  });

  // 打开设置窗口
  ipcMain.handle('open-settings', () => {
    console.log('🔧 收到打开设置窗口的请求');
    createSettingsWindow();
  });

  // 通知主窗口刷新快捷键
  ipcMain.handle('refresh-shortcuts', () => {
    console.log('🔄 通知主窗口刷新快捷键列表');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('shortcuts-updated');
    }
  });

  // 选择应用程序
  ipcMain.handle('select-application', async () => {
    const { dialog } = require('electron');
    try {
      const result = await dialog.showOpenDialog({
        title: '选择应用程序',
        defaultPath: '/Applications',
        properties: ['openFile'],
        filters: [
          { name: '应用程序', extensions: ['app'] }
        ]
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        const appPath = result.filePaths[0];
        const appName = path.basename(appPath, '.app');
        return {
          success: true,
          path: appPath,
          name: appName
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('选择应用程序失败:', error);
      return { success: false, error: error.message };
    }
  });


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出时注销快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// 阻止默认菜单
app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
}); 