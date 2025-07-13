class ElectronService {
  constructor() {
    this.ipcRenderer = null;
    this.isElectron = false;
    
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        this.ipcRenderer = ipcRenderer;
        this.isElectron = true;
      }
    } catch (error) {
      console.warn('Electron IPC不可用:', error);
    }
  }

  // 获取所有快捷键
  async getShortcuts() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return [];
    }
    
    try {
      return await this.ipcRenderer.invoke('get-shortcuts');
    } catch (error) {
      console.error('获取快捷键失败:', error);
      return [];
    }
  }

  // 获取所有快捷键（包括禁用的）
  async getAllShortcuts() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return [];
    }
    
    try {
      return await this.ipcRenderer.invoke('get-all-shortcuts');
    } catch (error) {
      console.error('获取所有快捷键失败:', error);
      return [];
    }
  }

  // 执行快捷键
  async executeShortcut(id) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return { success: false, error: '不在Electron环境中' };
    }
    
    try {
      return await this.ipcRenderer.invoke('execute-shortcut', id);
    } catch (error) {
      console.error('执行快捷键失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 添加快捷键
  async addShortcut(shortcut) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return false;
    }
    
    try {
      return await this.ipcRenderer.invoke('add-shortcut', shortcut);
    } catch (error) {
      console.error('添加快捷键失败:', error);
      return false;
    }
  }

  // 更新快捷键
  async updateShortcut(id, updates) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return false;
    }
    
    try {
      return await this.ipcRenderer.invoke('update-shortcut', id, updates);
    } catch (error) {
      console.error('更新快捷键失败:', error);
      return false;
    }
  }

  // 删除快捷键
  async deleteShortcut(id) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return false;
    }
    
    try {
      return await this.ipcRenderer.invoke('delete-shortcut', id);
    } catch (error) {
      console.error('删除快捷键失败:', error);
      return false;
    }
  }

  // 切换快捷键启用状态
  async toggleShortcut(id) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return false;
    }
    
    try {
      return await this.ipcRenderer.invoke('toggle-shortcut', id);
    } catch (error) {
      console.error('切换快捷键失败:', error);
      return false;
    }
  }

  // 重置配置
  async resetConfig() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return false;
    }
    
    try {
      return await this.ipcRenderer.invoke('reset-config');
    } catch (error) {
      console.error('重置配置失败:', error);
      return false;
    }
  }

  // 移动窗口
  moveWindow(x, y) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return;
    }
    
    try {
      this.ipcRenderer.send('move-window', { x, y });
    } catch (error) {
      console.error('移动窗口失败:', error);
    }
  }

  // 打开设置窗口
  async openSettings() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return;
    }
    
    try {
      await this.ipcRenderer.invoke('open-settings');
    } catch (error) {
      console.error('打开设置窗口失败:', error);
    }
  }


  // 通知主窗口刷新快捷键
  async refreshShortcuts() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return;
    }
    
    try {
      await this.ipcRenderer.invoke('refresh-shortcuts');
    } catch (error) {
      console.error('通知刷新快捷键失败:', error);
    }
  }

  // 监听快捷键更新事件
  onShortcutsUpdated(callback) {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return;
    }
    
    this.ipcRenderer.on('shortcuts-updated', callback);
    
    // 返回取消监听的函数
    return () => {
      this.ipcRenderer.removeListener('shortcuts-updated', callback);
    };
  }

  // 选择应用程序
  async selectApplication() {
    if (!this.isElectron) {
      console.warn('不在Electron环境中');
      return { success: false };
    }
    
    try {
      return await this.ipcRenderer.invoke('select-application');
    } catch (error) {
      console.error('选择应用程序失败:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ElectronService(); 