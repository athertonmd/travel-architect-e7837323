import { 
  ReactFlow, 
  Connection, 
  Edge, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Node, 
  Background, 
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnSelectionChangeParams
} from '@xyflow/react';
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback } from "react";
import { SegmentNodeData } from "@/types/segment";
import { FlowConfig } from "./FlowConfig";
import { useFlowDragDrop } from "./FlowDragDrop";
import { useFlowManagement } from "@/hooks/useFlowManagement";
import { Button } from "../ui/button";
import "@xyflow/react/dist/style.css";

interface FlowEditorProps {
  onNodesChange?: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect?: (node: Node<SegmentNodeData> | null) => void;
  initialNodes?: Node<SegmentNodeData>[];
  readOnly?: boolean;
}

const nodeTypes: NodeTypes = {
  segment: SegmentNode,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
  type: 'smoothstep',
  animated: true,
};

const minimapStyle = {
  height: 120,
  width: 160,
};

export const FlowEditor = ({ 
  onNodesChange: onNodesUpdate, 
  onNodeSelect,
  initialNodes = [],
  readOnly = false 
}: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SegmentNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { reorganizeNodes, updateEdges } = useFlowManagement();

  const handleSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (onNodeSelect && selectedNodes) {
      const selectedNode = selectedNodes[0] as Node<SegmentNodeData> | undefined;
      onNodeSelect(selectedNode || null);
    }
  }, [onNodeSelect]);

  const { onDragOver, onDrop } = useFlowDragDrop({ 
    nodes, 
    readOnly, 
    onNodesChange: (newNodes) => {
      const updatedNodes = reorganizeNodes(newNodes);
      setNodes(updatedNodes);
      setEdges(updateEdges(updatedNodes));
      if (onNodesUpdate) {
        onNodesUpdate(updatedNodes);
      }
    }
  });

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(() => {
    if (readOnly) return;
    
    setNodes((nds) => {
      const updatedNodes = reorganizeNodes(nds);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly]);

  const onNodesDelete = useCallback((nodesToDelete: Node<SegmentNodeData>[]) => {
    if (readOnly) return;

    setNodes((nds) => {
      const remainingNodes = nds.filter(
        (node) => !nodesToDelete.find((n) => n.id === node.id)
      );
      const updatedNodes = reorganizeNodes(remainingNodes);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly]);

  const fitView = useCallback(() => {
    const flowInstance = document.querySelector('.react-flow__viewport');
    if (flowInstance) {
      flowInstance.setAttribute('transform', 'translate(0,0) scale(1)');
    }
  }, []);

  return (
    <div className="h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={readOnly ? null : "Delete"}
        multiSelectionKeyCode={readOnly ? null : "Shift"}
        selectionOnDrag={!readOnly}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
      >
        <FlowConfig>
          <Panel position="top-right" className="bg-background/60 p-2 rounded-lg backdrop-blur-sm">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fitView}
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
        </FlowConfig>
      </ReactFlow>
    </div>
  );
};