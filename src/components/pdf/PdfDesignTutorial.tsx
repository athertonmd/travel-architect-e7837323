
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Choose your colors",
    description: "Select primary, secondary, and accent colors that match your brand identity",
    target: ".color-selector-step",
    position: "right"
  },
  {
    title: "Select fonts",
    description: "Choose appropriate fonts for headers and body text",
    target: ".font-selector-step",
    position: "right"
  },
  {
    title: "Customize content",
    description: "Toggle which elements to include in your PDF exports",
    target: "button[value='content']",
    position: "top"
  },
  {
    title: "Add company details",
    description: "Include your company name and branding information",
    target: "button[value='header']",
    position: "top"
  },
  {
    title: "Preview your design",
    description: "See a live preview of how your PDF will look",
    target: ".preview-section",
    position: "top"
  }
];

export function PdfDesignTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [animationDirection, setAnimationDirection] = useState('right');
  
  const dismissTutorial = () => {
    setIsVisible(false);
    // Could save to localStorage to prevent showing on future visits
    localStorage.setItem('pdfDesignTutorialSeen', 'true');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    // Check if user has already seen the tutorial
    const tutorialSeen = localStorage.getItem('pdfDesignTutorialSeen');
    if (tutorialSeen === 'true') {
      setIsVisible(false);
      return;
    }

    const positionTooltip = () => {
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setAnimationDirection(step.position);
        
        if (step.position === 'right') {
          setPosition({
            top: rect.top + rect.height / 2 - 75,
            left: rect.right + 20
          });
        } else if (step.position === 'left') {
          setPosition({
            top: rect.top + rect.height / 2 - 75,
            left: rect.left - 320
          });
        } else if (step.position === 'top') {
          setPosition({
            top: rect.top - 180,
            left: rect.left + rect.width / 2 - 150
          });
        } else {
          setPosition({
            top: rect.bottom + 20,
            left: rect.left + rect.width / 2 - 150
          });
        }
      }
    };

    // Position tooltip initially and on resize
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    
    // Re-position when step changes
    const timer = setTimeout(positionTooltip, 100);
    
    return () => {
      window.removeEventListener('resize', positionTooltip);
      clearTimeout(timer);
    };
  }, [currentStep, steps]);

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh' 
      }}
    >
      <div className="absolute w-full h-full bg-black/30 pointer-events-auto" onClick={dismissTutorial} />
      
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
          onClick={dismissTutorial}
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
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div className="flex gap-1 items-center">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    idx === currentStep ? "bg-gold" : "bg-gray-400"
                  )}
                />
              ))}
            </div>
            <Button 
              variant="default" 
              size="sm" 
              onClick={nextStep}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
