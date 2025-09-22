import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Code, Download, Eye, Trash2, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';

export const Toolbar = () => {
  const { 
    elements, 
    canvas, 
    setCanvasZoom, 
    clearCanvas, 
    generateCode 
  } = useBuilderStore();
  
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerateCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
    setShowCodeModal(true);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedComponent.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => {
    setCanvasZoom(Math.min(canvas.zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setCanvasZoom(Math.max(canvas.zoom / 1.2, 0.1));
  };

  return (
    <div className="h-14 builder-surface border-b builder-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold builder-text">App Builder</h1>
        <Badge variant="secondary" className="ml-2">
          {elements.length} elements
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 mr-4">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm builder-text-muted min-w-12 text-center">
            {Math.round(canvas.zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="sm" disabled>
          <Undo2 className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" disabled>
          <Redo2 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 builder-border" />

        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
          Preview
        </Button>

        <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleGenerateCode}>
              <Code className="w-4 h-4" />
              Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Generated Code
                <Button size="sm" onClick={handleDownloadCode}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearCanvas}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};