import { PanelResizeHandle } from 'react-resizable-panels';

export function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-2 mx-1 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 group">
      <div className="w-0.5 h-full mx-auto bg-gray-200 group-hover:bg-gray-400 group-active:bg-gray-500 transition-colors duration-200" />
    </PanelResizeHandle>
  );
}
