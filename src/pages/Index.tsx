import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';
import { useBuilderStore } from '@/store/builderStore';

const Index = () => {
  const { selectedElement } = useBuilderStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col builder-bg builder-text">
        <Toolbar />
        
        <div className="flex-1 flex">
          {/* Component Library Sidebar */}
          <BuilderSidebar />
          
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            <Canvas />
          </div>
          
          {/* Properties Panel */}
          {selectedElement && <PropertiesPanel />}
        </div>
      </div>
    </DndProvider>
  );
};

export default Index;