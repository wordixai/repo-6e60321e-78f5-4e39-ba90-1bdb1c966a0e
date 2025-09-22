import { useState } from 'react';
import { Element, useBuilderStore } from '@/store/builderStore';
import { X, Move } from 'lucide-react';

interface CanvasElementProps {
  element: Element;
}

export const CanvasElement = ({ element }: CanvasElementProps) => {
  const { selectedElement, selectElement, removeElement, updateElement } = useBuilderStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const isSelected = selectedElement?.id === element.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.element-drag-handle')) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - (element.position?.x || 0), 
        y: e.clientY - (element.position?.y || 0) 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      updateElement(element.id, {
        position: { x: newX, y: newY }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const renderElement = () => {
    const { type, props } = element;
    const ElementTag = type as keyof JSX.IntrinsicElements;
    
    // Handle self-closing elements
    if (['img', 'input', 'br', 'hr'].includes(type)) {
      return <ElementTag {...props} />;
    }
    
    return (
      <ElementTag {...props}>
        {props.children}
      </ElementTag>
    );
  };

  return (
    <div
      className={`absolute cursor-pointer group ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isHovered ? 'ring-1 ring-blue-300' : ''}`}
      style={{
        left: element.position?.x || 0,
        top: element.position?.y || 0,
        width: element.size?.width || 'auto',
        height: element.size?.height || 'auto'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Element content */}
      <div className="relative">
        {renderElement()}
        
        {/* Element controls overlay */}
        {(isSelected || isHovered) && (
          <div className="absolute -top-8 left-0 flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            <Move className="w-3 h-3 element-drag-handle cursor-move" />
            <span>{element.type}</span>
            <button
              onClick={handleDelete}
              className="w-4 h-4 flex items-center justify-center hover:bg-red-500 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};