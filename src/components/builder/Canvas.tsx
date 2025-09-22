import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilderStore, Element } from '@/store/builderStore';
import { CanvasElement } from './CanvasElement';

export const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, canvas } = useBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (offset && canvasRect) {
          const x = (offset.x - canvasRect.left) / canvas.zoom;
          const y = (offset.y - canvasRect.top) / canvas.zoom;
          
          const newElement: Element = {
            id: `${item.type}-${Date.now()}`,
            type: item.type,
            props: item.props,
            position: { x, y }
          };
          
          addElement(newElement);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }));

  return (
    <div className="flex-1 overflow-hidden">
      <div
        ref={(node) => {
          drop(node);
          canvasRef.current = node;
        }}
        className={`w-full h-full canvas-bg relative ${
          isOver ? 'canvas-grid' : ''
        }`}
        style={{
          transform: `scale(${canvas.zoom}) translate(${canvas.position.x}px, ${canvas.position.y}px)`,
          transformOrigin: 'top left'
        }}
      >
        {/* Drop zone overlay when dragging */}
        {isOver && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 font-medium">Drop component here</div>
          </div>
        )}

        {/* Render all elements */}
        {elements.map((element) => (
          <CanvasElement key={element.id} element={element} />
        ))}

        {/* Canvas grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>
    </div>
  );
};