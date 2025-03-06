
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorialStep } from './tutorialSteps';
import { Position } from './useTutorialPosition';

interface TutorialCardProps {
  step: TutorialStep;
  position: Position;
  animationDirection: "right" | "left" | "top" | "bottom";
  currentStepIndex: number;
  totalSteps: number;
  onDismiss: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function TutorialCard({
  step,
  position,
  animationDirection,
  currentStepIndex,
  totalSteps,
  onDismiss,
  onNext,
  onPrevious
}: TutorialCardProps) {
  return (
    <Card 
      className={cn(
        "w-[300px] pointer-events-auto absolute shadow-lg",
        animationDirection === 'right' && "animate-slide-in-right",
        animationDirection === 'left' && "animate-slide-in-left",
        animationDirection === 'top' && "animate-slide-in-top",
        animationDirection === 'bottom' && "animate-slide-in-bottom",
      )}
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transition: 'all 0.3s ease-out'
      }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2" 
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardContent className="pt-6 pb-4">
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-lg text-gold">
            {step.title}
          </h4>
          <p className="text-sm text-gray-200">
            {step.description}
          </p>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
          >
            Previous
          </Button>
          <div className="flex gap-1 items-center">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-2 h-2 rounded-full",
                  idx === currentStepIndex ? "bg-gold" : "bg-gray-400"
                )}
              />
            ))}
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onNext}
          >
            {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
