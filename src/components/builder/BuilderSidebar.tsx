import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Type, Square, Image, Button as ButtonIcon, Layout, Grid3X3 } from 'lucide-react';

const componentLibrary = [
  {
    category: 'Layout',
    components: [
      {
        type: 'div',
        name: 'Container',
        icon: <Square className="w-4 h-4" />,
        defaultProps: {
          className: 'p-4 border border-gray-200 rounded-lg',
          children: 'Container'
        }
      },
      {
        type: 'div',
        name: 'Flex Container',
        icon: <Layout className="w-4 h-4" />,
        defaultProps: {
          className: 'flex gap-4 p-4 border border-gray-200 rounded-lg',
          children: 'Flex Container'
        }
      },
      {
        type: 'div',
        name: 'Grid Container',
        icon: <Grid3X3 className="w-4 h-4" />,
        defaultProps: {
          className: 'grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg',
          children: 'Grid Container'
        }
      }
    ]
  },
  {
    category: 'Typography',
    components: [
      {
        type: 'h1',
        name: 'Heading 1',
        icon: <Type className="w-4 h-4" />,
        defaultProps: {
          className: 'text-4xl font-bold',
          children: 'Heading 1'
        }
      },
      {
        type: 'h2',
        name: 'Heading 2',
        icon: <Type className="w-4 h-4" />,
        defaultProps: {
          className: 'text-3xl font-semibold',
          children: 'Heading 2'
        }
      },
      {
        type: 'p',
        name: 'Paragraph',
        icon: <Type className="w-4 h-4" />,
        defaultProps: {
          className: 'text-base text-gray-700',
          children: 'This is a paragraph of text.'
        }
      }
    ]
  },
  {
    category: 'Interactive',
    components: [
      {
        type: 'button',
        name: 'Button',
        icon: <ButtonIcon className="w-4 h-4" />,
        defaultProps: {
          className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600',
          children: 'Click me'
        }
      },
      {
        type: 'input',
        name: 'Input',
        icon: <Square className="w-4 h-4" />,
        defaultProps: {
          type: 'text',
          placeholder: 'Enter text...',
          className: 'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        }
      }
    ]
  },
  {
    category: 'Media',
    components: [
      {
        type: 'img',
        name: 'Image',
        icon: <Image className="w-4 h-4" />,
        defaultProps: {
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
          alt: 'Placeholder image',
          className: 'w-full h-48 object-cover rounded-lg'
        }
      }
    ]
  }
];

interface DraggableComponentProps {
  component: any;
}

const DraggableComponent = ({ component }: DraggableComponentProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: {
      type: component.type,
      props: component.defaultProps,
      id: `${component.type}-${Date.now()}`
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`p-3 builder-surface rounded-lg border builder-border cursor-move hover:builder-accent transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {component.icon}
        <span className="text-sm builder-text">{component.name}</span>
      </div>
    </div>
  );
};

export const BuilderSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLibrary = componentLibrary.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  return (
    <div className="w-80 builder-surface border-r builder-border flex flex-col">
      <div className="p-4 border-b builder-border">
        <h2 className="text-lg font-semibold builder-text mb-3">Components</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 builder-text-muted" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 builder-surface border-builder-border"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {filteredLibrary.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium builder-text">{category.category}</h3>
                <Badge variant="secondary" className="text-xs">
                  {category.components.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {category.components.map((component) => (
                  <DraggableComponent
                    key={component.name}
                    component={component}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};