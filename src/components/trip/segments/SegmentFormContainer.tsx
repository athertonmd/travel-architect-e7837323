import { ReactNode } from "react";

interface SegmentFormContainerProps {
  children: ReactNode;
  onInteraction: (e: React.MouseEvent | React.FocusEvent) => void;
}

export function SegmentFormContainer({ children, onInteraction }: SegmentFormContainerProps) {
  return (
    <div 
      onClick={onInteraction} 
      onMouseDown={onInteraction}
      onPointerDown={onInteraction}
      className="segment-form-container"
    >
      {children}
    </div>
  );
}