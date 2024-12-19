import { Panel, Controls, MiniMap, Background, BackgroundVariant } from '@xyflow/react';
import { Button } from "@/components/ui/button";

interface FlowControlsProps {
  onFitView: () => void;
}

export function FlowControls({ onFitView }: FlowControlsProps) {
  const minimapStyle = {
    height: 120,
    width: 160,
  };

  return (
    <>
      <Panel position="top-right" className="bg-background/60 p-2 rounded-lg backdrop-blur-sm">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onFitView}
          className="text-xs"
        >
          Reset View
        </Button>
      </Panel>
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={12} 
        size={1}
        color="#e5e7eb"
      />
      <Controls 
        className="bg-background/60 backdrop-blur-sm"
        showInteractive={false}
      />
      <MiniMap 
        style={minimapStyle}
        className="bg-background/60 backdrop-blur-sm"
        nodeColor={(node) => {
          switch (node.type) {
            case 'segment':
              return '#93c5fd';
            default:
              return '#e5e7eb';
          }
        }}
        maskColor="rgba(0, 0, 0, 0.1)"
      />
    </>
  );
}