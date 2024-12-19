import { ReactNode } from "react";
import { FlowControls } from "./FlowControls";

interface FlowConfigurationProps {
  children: ReactNode;
  onFitView: () => void;
}

export function FlowConfiguration({ children, onFitView }: FlowConfigurationProps) {
  return (
    <>
      {children}
      <FlowControls onFitView={onFitView} />
    </>
  );
}