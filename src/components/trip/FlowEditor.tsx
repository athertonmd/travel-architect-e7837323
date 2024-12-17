import { ReactFlow, Connection, Edge, useNodesState, useEdgesState, addEdge, Node, Background, Controls } from "@xyflow/react";
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback } from "react";
import { SegmentNodeData } from "@/types/segment";
import { FlowConfig } from "./FlowConfig";
import { useFlowDragDrop } from "./FlowDragDrop";
import { useFlowManagement } from "@/hooks/useFlowManagement";
import "@xyflow/react/dist/style.css";

interface FlowEditorProps {
  onNodesChange?: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect?: (node: Node<SegmentNodeData> | null) => void;
  initialNodes?: Node<SegmentNodeData>[];
  readOnly?: boolean;
}

const nodeTypes = {
  segment: SegmentNode,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
  type: 'smoothstep',
  animated: false,
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
  const { onDragOver, onDrop } = useFlowDragDrop({ 
    nodes, 
    readOnly, 
    onNodesChange: (newNodes) => {
      const updatedNodes = reorganizeNodes(newNodes);
      setNodes(updatedNodes);
      setEdges(updateEdges(updatedNodes));
    }
  });

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
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
          <Background />
          <Controls />
        </FlowConfig>
      </ReactFlow>
    </div>
  );
};