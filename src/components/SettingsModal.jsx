import { useState, useEffect } from 'react';
import electronService from '@/services/electronService';

const SettingsModal = ({ onClose, onShortcutsChange }) => {
  const [shortcuts, setShortcuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShortcut, setNewShortcut] = useState({
    title: '',
    icon: '🔧',
    type: 'application',
    command: ''
  });

  // 加载所有快捷键（包括禁用的）
  const loadAllShortcuts = async () => {
    try {
      // 获取完整配置而不是过滤后的
      const data = await electronService.getAllShortcuts();
      setShortcuts(data);
    } catch (error) {
      console.error('加载快捷键失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllShortcuts();
  }, []);

  // 切换快捷键启用状态
  const handleToggleShortcut = async (id) => {
    try {
      await electronService.toggleShortcut(id);
      await loadAllShortcuts();
      onShortcutsChange();
    } catch (error) {
      console.error('切换快捷键状态失败:', error);
    }
  };

  // 删除快捷键
  const handleDeleteShortcut = async (id) => {
    if (window.confirm('确定要删除这个快捷键吗？')) {
      try {
        await electronService.deleteShortcut(id);
        await loadAllShortcuts();
        onShortcutsChange();
      } catch (error) {
        console.error('删除快捷键失败:', error);
      }
    }
  };

  // 添加新快捷键
  const handleAddShortcut = async (e) => {
    e.preventDefault();
    if (!newShortcut.title || !newShortcut.command) {
      alert('请填写标题和命令');
      return;
    }

    try {
      await electronService.addShortcut(newShortcut);
      await loadAllShortcuts();
      onShortcutsChange();
      setShowAddForm(false);
      setNewShortcut({
        title: '',
        icon: '🔧',
        type: 'application',
        command: ''
      });
    } catch (error) {
      console.error('添加快捷键失败:', error);
    }
  };

  // 重置为默认配置
  const handleResetConfig = async () => {
    if (window.confirm('确定要重置为默认配置吗？这将删除所有自定义快捷键。')) {
      try {
        await electronService.resetConfig();
        await loadAllShortcuts();
        onShortcutsChange();
      } catch (error) {
        console.error('重置配置失败:', error);
      }
    }
  };

  const commonEmojis = ['🏠', '💻', '🌐', '⚙️', '📊', '✉️', '📸', '🔧', '📁', '🎵', '🎮', '📝', '🔍', '💼', '🖼️'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90vw] h-[98vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">快捷键设置</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-lg">加载中...</div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* 快捷键列表 */}
            <div className="space-y-3 mb-6">
              {shortcuts.map((shortcut) => (
                                 <div
                   key={shortcut.id}
                   className={`flex items-center justify-between p-4 rounded-lg border ${
                     shortcut.enabled
                       ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                       : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-500 opacity-60'
                   }`}
                 >
                   <div className="flex items-center space-x-4">
                     <span className="text-3xl">{shortcut.icon}</span>
                     <div>
                       <div className="font-medium text-lg text-gray-900 dark:text-white">
                         {shortcut.title}
                       </div>
                       <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                         {shortcut.type}: {shortcut.command}
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center space-x-3">
                     <button
                       onClick={() => handleToggleShortcut(shortcut.id)}
                       className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                         shortcut.enabled
                           ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                           : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500'
                       }`}
                     >
                       {shortcut.enabled ? '启用' : '禁用'}
                     </button>
                     <button
                       onClick={() => handleDeleteShortcut(shortcut.id)}
                       className="px-4 py-2 rounded text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                     >
                       删除
                     </button>
                   </div>
                 </div>
              ))}
            </div>

            {/* 添加新快捷键按钮 */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 px-4 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6 transition-colors"
              >
                添加新快捷键
              </button>
            )}

            {/* 添加快捷键表单 */}
            {showAddForm && (
              <form onSubmit={handleAddShortcut} className="space-y-5 mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    标题
                  </label>
                  <input
                    type="text"
                    value={newShortcut.title}
                    onChange={(e) => setNewShortcut({ ...newShortcut, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="快捷键名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    图标
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newShortcut.icon}
                      onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                    />
                    <span className="text-gray-500 dark:text-gray-400">或选择:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewShortcut({ ...newShortcut, icon: emoji })}
                        className="w-8 h-8 text-lg hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    类型
                  </label>
                  <select
                    value={newShortcut.type}
                    onChange={(e) => setNewShortcut({ ...newShortcut, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="application">应用程序</option>
                    <option value="script">脚本/命令</option>
                    <option value="url">网址</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    命令
                  </label>
                  <input
                    type="text"
                    value={newShortcut.command}
                    onChange={(e) => setNewShortcut({ ...newShortcut, command: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder={
                      newShortcut.type === 'application' 
                        ? 'Application Name (e.g., Terminal, Chrome)'
                        : newShortcut.type === 'url'
                        ? 'https://example.com'
                        : 'shell command or script'
                    }
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    添加
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}

            {/* 重置按钮 */}
            <button
              onClick={handleResetConfig}
              className="w-full py-3 px-4 text-lg bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              重置为默认配置
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal; 