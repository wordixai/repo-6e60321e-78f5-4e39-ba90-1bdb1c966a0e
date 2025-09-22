import { create } from 'zustand';

export interface Element {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Element[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface BuilderState {
  elements: Element[];
  selectedElement: Element | null;
  draggedElement: Element | null;
  canvas: {
    zoom: number;
    position: { x: number; y: number };
  };
  
  // Actions
  addElement: (element: Element) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  selectElement: (element: Element | null) => void;
  setDraggedElement: (element: Element | null) => void;
  setCanvasZoom: (zoom: number) => void;
  setCanvasPosition: (position: { x: number; y: number }) => void;
  generateCode: () => string;
  clearCanvas: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  elements: [],
  selectedElement: null,
  draggedElement: null,
  canvas: {
    zoom: 1,
    position: { x: 0, y: 0 }
  },

  addElement: (element) => {
    set((state) => ({
      elements: [...state.elements, element]
    }));
  },

  removeElement: (id) => {
    set((state) => ({
      elements: state.elements.filter(el => el.id !== id),
      selectedElement: state.selectedElement?.id === id ? null : state.selectedElement
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
      selectedElement: state.selectedElement?.id === id 
        ? { ...state.selectedElement, ...updates }
        : state.selectedElement
    }));
  },

  selectElement: (element) => {
    set({ selectedElement: element });
  },

  setDraggedElement: (element) => {
    set({ draggedElement: element });
  },

  setCanvasZoom: (zoom) => {
    set((state) => ({
      canvas: { ...state.canvas, zoom }
    }));
  },

  setCanvasPosition: (position) => {
    set((state) => ({
      canvas: { ...state.canvas, position }
    }));
  },

  clearCanvas: () => {
    set({
      elements: [],
      selectedElement: null
    });
  },

  generateCode: () => {
    const { elements } = get();
    
    const generateComponentCode = (element: Element): string => {
      const { type, props, children } = element;
      
      const propsString = Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value}"`;
          }
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(' ');

      const childrenCode = children?.map(generateComponentCode).join('\n    ') || '';
      
      if (childrenCode) {
        return `<${type} ${propsString}>
    ${childrenCode}
</${type}>`;
      }
      
      return `<${type} ${propsString} />`;
    };

    const componentsCode = elements.map(generateComponentCode).join('\n  ');

    return `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="min-h-screen">
      ${componentsCode}
    </div>
  );
};

export default GeneratedComponent;`;
  }
}));