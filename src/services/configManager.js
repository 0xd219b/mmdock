const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), 'config.json');
    this.defaultConfig = {
      shortcuts: [
        {
          id: 'home',
          title: 'Finder',
          icon: '🏠',
          type: 'application',
          command: 'Finder',
          enabled: true
        },
        {
          id: 'terminal',
          title: 'Terminal',
          icon: '💻',
          type: 'application',
          command: 'Terminal',
          enabled: true
        },
        {
          id: 'browser',
          title: 'Chrome',
          icon: '🌐',
          type: 'application',
          command: 'Google Chrome',
          enabled: true
        },
        {
          id: 'code',
          title: 'VS Code',
          icon: '⚙️',
          type: 'application',
          command: 'Visual Studio Code',
          enabled: true
        },
        {
          id: 'activity',
          title: 'Activity Monitor',
          icon: '📊',
          type: 'application',
          command: 'Activity Monitor',
          enabled: true
        },
        {
          id: 'email',
          title: 'Mail',
          icon: '✉️',
          type: 'application',
          command: 'Mail',
          enabled: true
        },
        {
          id: 'screenshot',
          title: 'Screenshot',
          icon: '📸',
          type: 'script',
          command: 'screencapture -i ~/Desktop/screenshot-$(date +%Y%m%d-%H%M%S).png',
          enabled: true
        },
        {
          id: 'open-downloads',
          title: 'Downloads',
          icon: '⬇️',
          type: 'script',
          command: 'open ~/Downloads',
          enabled: true
        }
      ]
    };
  }

  // 加载配置文件
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('读取配置文件失败:', error);
    }
    
    // 如果文件不存在或读取失败，返回默认配置
    return this.defaultConfig;
  }

  // 保存配置文件
  saveConfig(config) {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      return true;
    } catch (error) {
      console.error('保存配置文件失败:', error);
      return false;
    }
  }

  // 获取所有快捷键
  getShortcuts() {
    const config = this.loadConfig();
    return config.shortcuts.filter(shortcut => shortcut.enabled);
  }

  // 获取所有快捷键（包括禁用的）
  getAllShortcuts() {
    const config = this.loadConfig();
    return config.shortcuts;
  }

  // 获取单个快捷键
  getShortcut(id) {
    const config = this.loadConfig();
    return config.shortcuts.find(shortcut => shortcut.id === id);
  }

  // 添加快捷键
  addShortcut(shortcut) {
    const config = this.loadConfig();
    const newShortcut = {
      id: shortcut.id || Date.now().toString(),
      title: shortcut.title || 'New Shortcut',
      icon: shortcut.icon || 'default',
      type: shortcut.type || 'application',
      command: shortcut.command || '',
      enabled: shortcut.enabled !== false
    };
    
    config.shortcuts.push(newShortcut);
    return this.saveConfig(config);
  }

  // 更新快捷键
  updateShortcut(id, updates) {
    const config = this.loadConfig();
    const index = config.shortcuts.findIndex(shortcut => shortcut.id === id);
    
    if (index !== -1) {
      config.shortcuts[index] = { ...config.shortcuts[index], ...updates };
      return this.saveConfig(config);
    }
    
    return false;
  }

  // 删除快捷键
  deleteShortcut(id) {
    const config = this.loadConfig();
    const index = config.shortcuts.findIndex(shortcut => shortcut.id === id);
    
    if (index !== -1) {
      config.shortcuts.splice(index, 1);
      return this.saveConfig(config);
    }
    
    return false;
  }

  // 切换快捷键启用状态
  toggleShortcut(id) {
    const config = this.loadConfig();
    const shortcut = config.shortcuts.find(shortcut => shortcut.id === id);
    
    if (shortcut) {
      shortcut.enabled = !shortcut.enabled;
      return this.saveConfig(config);
    }
    
    return false;
  }

  // 重置为默认配置
  resetToDefault() {
    return this.saveConfig(this.defaultConfig);
  }
}

module.exports = ConfigManager; 