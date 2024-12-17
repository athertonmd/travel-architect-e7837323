import { ReactNode } from "react";

interface FlowConfigProps {
  children: ReactNode;
}

export function FlowConfig({ children }: FlowConfigProps) {
  return (
    <>
      {children}
    </>
  );
}