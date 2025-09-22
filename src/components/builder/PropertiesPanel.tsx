import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useBuilderStore } from '@/store/builderStore';

export const PropertiesPanel = () => {
  const { selectedElement, updateElement } = useBuilderStore();

  if (!selectedElement) return null;

  const handlePropChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        [key]: value
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: value
      }
    });
  };

  const renderPropertyInput = (key: string, value: any) => {
    // Handle common CSS classes
    if (key === 'className') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => handlePropChange(key, e.target.value)}
          placeholder="CSS classes..."
          className="font-mono text-sm"
        />
      );
    }

    // Handle text content
    if (key === 'children' && typeof value === 'string') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => handlePropChange(key, e.target.value)}
          placeholder="Element content..."
        />
      );
    }

    // Handle input types
    if (key === 'type' && selectedElement.type === 'input') {
      return (
        <Select value={value || 'text'} onValueChange={(val) => handlePropChange(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="tel">Phone</SelectItem>
            <SelectItem value="url">URL</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    // Default input
    return (
      <Input
        value={value || ''}
        onChange={(e) => handlePropChange(key, e.target.value)}
        placeholder={`Enter ${key}...`}
      />
    );
  };

  return (
    <div className="w-80 builder-surface border-l builder-border flex flex-col">
      <div className="p-4 border-b builder-border">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold builder-text">Properties</h3>
          <Badge variant="secondary">{selectedElement.type}</Badge>
        </div>
        <p className="text-sm builder-text-muted">ID: {selectedElement.id}</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Position & Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Position & Size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pos-x" className="text-xs">X</Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={selectedElement.position?.x || 0}
                  onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs">Y</Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={selectedElement.position?.y || 0}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Element Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(selectedElement.props).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="text-xs capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {renderPropertyInput(key, value)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Styles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePropChange('className', 
                  `${selectedElement.props.className || ''} shadow-lg`.trim()
                )}
                className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Add Shadow
              </button>
              <button
                onClick={() => handlePropChange('className', 
                  `${selectedElement.props.className || ''} rounded-lg`.trim()
                )}
                className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Round Corners
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};