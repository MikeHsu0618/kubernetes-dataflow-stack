import React, { useEffect, useRef } from 'react';

function Drawer({ isOpen, onClose, children }) {
  const drawerRef = useRef(null);

  // 點擊抽屜外部時關閉
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    }

    // 只有在抽屜打開時才添加事件監聽器
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 按 ESC 鍵關閉抽屜
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* 背景遮罩 - 覆蓋整個頁面 */}
      <div 
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[100] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* 側邊抽屜 - 確保完全覆蓋右側，包括頂部 */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 bottom-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl z-[10000] transform transition-transform duration-300 ease-in-out overflow-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-medium text-gray-900">Alert Details</h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Drawer; 