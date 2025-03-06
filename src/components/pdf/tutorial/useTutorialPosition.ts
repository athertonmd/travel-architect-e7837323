
import { useState, useEffect } from 'react';
import { TutorialStep } from './tutorialSteps';

export interface Position {
  top: number;
  left: number;
}

export function useTutorialPosition(
  currentStep: number, 
  steps: TutorialStep[]
) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [animationDirection, setAnimationDirection] = useState<"right" | "left" | "top" | "bottom">('right');
  
  useEffect(() => {
    const positionTooltip = () => {
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = 300; // Width of the tooltip card
        const tooltipHeight = 180; // Approximate height of the tooltip card
        
        setAnimationDirection(step.position);
        
        let newTop = 0;
        let newLeft = 0;
        
        // Calculate position based on the direction and available space
        if (step.position === 'right') {
          newLeft = rect.right + 20;
          newTop = rect.top + rect.height / 2 - tooltipHeight / 2;
          
          // Check if tooltip would go off-screen to the right
          if (newLeft + tooltipWidth > viewportWidth) {
            newLeft = rect.left - tooltipWidth - 20; // Place it to the left instead
            setAnimationDirection('left');
          }
        } else if (step.position === 'left') {
          newLeft = rect.left - tooltipWidth - 20;
          newTop = rect.top + rect.height / 2 - tooltipHeight / 2;
          
          // Check if tooltip would go off-screen to the left
          if (newLeft < 0) {
            newLeft = rect.right + 20; // Place it to the right instead
            setAnimationDirection('right');
          }
        } else if (step.position === 'top') {
          newLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
          newTop = rect.top - tooltipHeight - 20;
          
          // Check if tooltip would go off-screen to the top
          if (newTop < 0) {
            newTop = rect.bottom + 20; // Place it to the bottom instead
            setAnimationDirection('bottom');
          }
        } else { // bottom
          newLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
          newTop = rect.bottom + 20;
          
          // Check if tooltip would go off-screen to the bottom
          if (newTop + tooltipHeight > viewportHeight) {
            newTop = rect.top - tooltipHeight - 20; // Place it to the top instead
            setAnimationDirection('top');
          }
        }
        
        // Ensure tooltip stays within horizontal bounds
        if (newLeft < 20) newLeft = 20;
        if (newLeft + tooltipWidth > viewportWidth - 20) newLeft = viewportWidth - tooltipWidth - 20;
        
        // Ensure tooltip stays within vertical bounds
        if (newTop < 20) newTop = 20;
        if (newTop + tooltipHeight > viewportHeight - 20) newTop = viewportHeight - tooltipHeight - 20;
        
        setPosition({ top: newTop, left: newLeft });
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

  return { position, animationDirection };
}
