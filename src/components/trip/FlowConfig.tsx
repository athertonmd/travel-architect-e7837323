import { ReactNode } from "react";
import { Background, Controls } from "@xyflow/react";

interface FlowConfigProps {
  children: ReactNode;
}

export function FlowConfig({ children }: FlowConfigProps) {
  return (
    <>
      {children}
      <Background />
      <Controls />
    </>
  );
}