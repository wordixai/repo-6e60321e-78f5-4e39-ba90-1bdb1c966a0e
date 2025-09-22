import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilderStore, Element } from '@/store/builderStore';
import { CanvasElement } from './CanvasElement';

export const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, canvas, selectElement } = useBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (offset && canvasRect) {
          const x = (offset.x - canvasRect.left) / canvas.zoom - canvas.position.x;
          const y = (offset.y - canvasRect.top) / canvas.zoom - canvas.position.y;
          
          const newElement: Element = {
            id: `${item.type}-${Date.now()}`,
            type: item.type,
            props: item.props,
            position: { x: Math.max(0, x), y: Math.max(0, y) }
          };
          
          addElement(newElement);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div
        ref={(node) => {
          drop(node);
          canvasRef.current = node;
        }}
        className={`relative min-h-full min-w-full bg-white ${
          isOver ? 'bg-blue-50' : ''
        }`}
        style={{
          transform: `scale(${canvas.zoom})`,
          transformOrigin: 'top left',
          width: '100%',
          height: '100vh',
          backgroundImage: `
            linear-gradient(to right, #f3f4f6 1px, transparent 1px),
            linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
        onClick={handleCanvasClick}
      >
        {/* Drop zone overlay when dragging */}
        {isOver && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center z-10">
            <div className="text-blue-600 font-medium bg-white px-4 py-2 rounded-lg shadow-lg">
              Drop component here
            </div>
          </div>
        )}

        {/* Render all elements */}
        {elements.map((element) => (
          <CanvasElement key={element.id} element={element} />
        ))}

        {/* Empty state */}
        {elements.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-xl font-medium mb-2">Start Building</div>
              <div className="text-sm">Drag components from the sidebar to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};