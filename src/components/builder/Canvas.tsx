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
      console.log('Dropping item:', item);
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (offset && canvasRect) {
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top;
          
          console.log('Drop position:', { x, y });
          
          const newElement: Element = {
            id: `${item.type}-${Date.now()}`,
            type: item.type,
            props: { ...item.props },
            position: { x: Math.max(0, x), y: Math.max(0, y) }
          };
          
          console.log('Adding element:', newElement);
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

  console.log('Canvas elements:', elements);

  return (
    <div className="flex-1 overflow-hidden bg-gray-100">
      <div
        ref={(node) => {
          drop(node);
          canvasRef.current = node;
        }}
        className="relative w-full h-full bg-white"
        style={{
          minHeight: '100vh',
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
          <div className="absolute inset-0 bg-blue-50 bg-opacity-70 border-2 border-dashed border-blue-400 flex items-center justify-center z-50">
            <div className="text-blue-600 font-medium bg-white px-6 py-3 rounded-lg shadow-lg border">
              Drop component here
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm z-40">
          Elements: {elements.length}
        </div>

        {/* Render all elements */}
        {elements.map((element) => {
          console.log('Rendering element:', element);
          return (
            <CanvasElement key={element.id} element={element} />
          );
        })}

        {/* Empty state */}
        {elements.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🎨</div>
              <div className="text-2xl font-medium mb-3">Start Building</div>
              <div className="text-lg">Drag components from the sidebar to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};