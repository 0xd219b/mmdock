import { useState, useEffect } from 'react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import electronService from '@/services/electronService';

export function AppleStyleDock() {
  const [shortcuts, setShortcuts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载快捷键配置
  const loadShortcuts = async () => {
    try {
      const data = await electronService.getShortcuts();
      setShortcuts(data);
    } catch (error) {
      console.error('加载快捷键失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShortcuts();
    
    // 监听快捷键更新事件
    const unsubscribe = electronService.onShortcutsUpdated(() => {
      console.log('收到快捷键更新通知，刷新列表');
      loadShortcuts();
    });
    
    // 清理监听器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 执行快捷键
  const handleShortcutClick = async (id) => {
    try {
      const result = await electronService.executeShortcut(id);
      if (result.success) {
        console.log('快捷键执行成功:', result.message);
      } else {
        console.error('快捷键执行失败:', result.error);
      }
    } catch (error) {
      console.error('执行快捷键时出错:', error);
    }
  };

  // 打开设置
  const handleSettingsClick = async () => {
    try {
      await electronService.openSettings();
    } catch (error) {
      console.error('打开设置窗口失败:', error);
    }
  };


  if (loading) {
    return (
      <div className='flex justify-center items-end w-full h-full pt-12 overflow-visible'>
        <div className='text-gray-500'>加载中...</div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-end w-full h-full pt-12 overflow-visible'>
      <Dock className='items-end pb-3'>
        {shortcuts.map((shortcut) => (
          <DockItem
            key={shortcut.id}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
            onClick={() => handleShortcutClick(shortcut.id)}
          >
            <DockLabel>{shortcut.title}</DockLabel>
            <DockIcon>
              <div className='text-2xl flex items-center justify-center h-full w-full'>
                {shortcut.icon}
              </div>
            </DockIcon>
          </DockItem>
        ))}
        
        {/* 设置按钮 */}
        <DockItem
          className='aspect-square rounded-full bg-gray-300 dark:bg-neutral-700 cursor-pointer border-2 border-gray-400 dark:border-neutral-600'
          onClick={handleSettingsClick}
        >
          <DockLabel>Settings</DockLabel>
          <DockIcon>
            <div className='text-2xl flex items-center justify-center h-full w-full'>
              ⚙️
            </div>
          </DockIcon>
        </DockItem>
      </Dock>
    </div>
  );
} 