import { useState, useEffect } from 'react';
import electronService from '@/services/electronService';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

const SettingsPage = () => {
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
      await electronService.refreshShortcuts(); // 通知主窗口刷新
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
        await electronService.refreshShortcuts(); // 通知主窗口刷新
      } catch (error) {
        console.error('删除快捷键失败:', error);
      }
    }
  };

  // 选择应用程序
  const handleSelectApplication = async () => {
    try {
      const result = await electronService.selectApplication();
      if (result.success) {
        setNewShortcut({...newShortcut, command: result.path, title: newShortcut.title || result.name});
      }
    } catch (error) {
      console.error('选择应用程序失败:', error);
    }
  };

  // 添加新快捷键
  const handleAddShortcut = async (e) => {
    e.preventDefault();
    if (newShortcut.title && newShortcut.command) {
      try {
        await electronService.addShortcut(newShortcut);
        setNewShortcut({
          title: '',
          icon: '🔧',
          type: 'application',
          command: ''
        });
        setShowAddForm(false);
        await loadAllShortcuts();
        await electronService.refreshShortcuts(); // 通知主窗口刷新
      } catch (error) {
        console.error('添加快捷键失败:', error);
      }
    }
  };

  // 重置配置
  const handleResetConfig = async () => {
    if (window.confirm('确定要重置为默认配置吗？这将删除所有自定义快捷键。')) {
      try {
        await electronService.resetConfig();
        await loadAllShortcuts();
        await electronService.refreshShortcuts(); // 通知主窗口刷新
      } catch (error) {
        console.error('重置配置失败:', error);
      }
    }
  };

  const commonEmojis = ['🏠', '💻', '🌐', '⚙️', '📊', '✉️', '📸', '🔧', '📁', '🎵', '🎮', '📝', '🔍', '💼', '🖼️'];

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 p-8">
      <div className="h-full overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          快捷键设置
        </h1>

        {loading ? (
          <div className="text-center py-8 text-2xl text-gray-600 dark:text-gray-300">
            加载中...
          </div>
        ) : (
          <div className="space-y-8">
            {/* 快捷键列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                当前快捷键
              </h2>
              <div className="space-y-4">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      shortcut.enabled
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{shortcut.icon}</span>
                      <div>
                        <div className="font-semibold text-xl text-gray-900 dark:text-white">
                          {shortcut.title}
                        </div>
                        <div className="text-base text-gray-600 dark:text-gray-300">
                          {shortcut.type}: {shortcut.command}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleShortcut(shortcut.id)}
                        className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                          shortcut.enabled
                            ? 'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-800 dark:text-green-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {shortcut.enabled ? '已启用' : '已禁用'}
                      </button>
                      <button
                        onClick={() => handleDeleteShortcut(shortcut.id)}
                        className="px-4 py-2 rounded-lg text-base font-medium bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 添加新快捷键 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  添加新快捷键
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
                >
                  {showAddForm ? '取消' : '添加快捷键'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddShortcut} className="space-y-6">
                  {/* 标题 - 单独一行 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                      标题
                    </label>
                    <input
                      type="text"
                      value={newShortcut.title}
                      onChange={(e) => setNewShortcut({...newShortcut, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                      placeholder="快捷键标题"
                      required
                    />
                  </div>
                  
                  {/* 图标和类型 - 一行 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                        图标
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{newShortcut.icon}</span>
                        <select
                          value={newShortcut.icon}
                          onChange={(e) => setNewShortcut({...newShortcut, icon: e.target.value})}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                        >
                          {commonEmojis.map(emoji => (
                            <option key={emoji} value={emoji}>{emoji}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                        类型
                      </label>
                      <select
                        value={newShortcut.type}
                        onChange={(e) => setNewShortcut({...newShortcut, type: e.target.value, command: ''})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                      >
                        <option value="application">应用程序</option>
                        <option value="script">脚本/命令</option>
                        <option value="url">网址</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* 命令 - 单独一行 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {newShortcut.type === 'application' ? '应用程序' :
                       newShortcut.type === 'script' ? '脚本/命令' : '网址'}
                    </label>
                    {newShortcut.type === 'application' ? (
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={newShortcut.command}
                          onChange={(e) => setNewShortcut({...newShortcut, command: e.target.value})}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                          placeholder="输入应用程序名称或路径"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSelectApplication}
                          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          选择应用
                        </button>
                      </div>
                    ) : newShortcut.type === 'script' ? (
                      <div>
                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <AceEditor
                            mode="sh"
                            theme="github"
                            value={newShortcut.command}
                            onChange={(value) => setNewShortcut({...newShortcut, command: value})}
                            name="script-editor"
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: true,
                              enableSnippets: true,
                              showLineNumbers: true,
                              tabSize: 2,
                              fontSize: 14,
                              wrap: true,
                              showPrintMargin: false,
                              highlightActiveLine: true,
                              showGutter: true
                            }}
                            width="100%"
                            height="120px"
                            placeholder="输入Shell命令或脚本内容..."
                          />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          示例: open /Applications/Calculator.app 或 echo 'Hello World'
                        </p>
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={newShortcut.command}
                        onChange={(e) => setNewShortcut({...newShortcut, command: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                        placeholder="https://example.com"
                        required
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-lg"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
                    >
                      添加
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 重置配置 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                重置配置
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                这将删除所有自定义快捷键并恢复默认配置。
              </p>
              <button
                onClick={handleResetConfig}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg font-medium"
              >
                重置为默认配置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 