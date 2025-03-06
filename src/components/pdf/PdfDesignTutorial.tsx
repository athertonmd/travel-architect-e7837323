
import React, { useState, useEffect } from 'react';
import { tutorialSteps } from './tutorial/tutorialSteps';
import { useTutorialPosition } from './tutorial/useTutorialPosition';
import { TutorialCard } from './tutorial/TutorialCard';

export function PdfDesignTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { position, animationDirection } = useTutorialPosition(currentStep, tutorialSteps);
  
  const dismissTutorial = () => {
    setIsVisible(false);
    // Save to localStorage to prevent showing on future visits
    localStorage.setItem('pdfDesignTutorialSeen', 'true');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
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
    }
  }, []);

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

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
      
      <TutorialCard
        step={step}
        position={position}
        animationDirection={animationDirection}
        currentStepIndex={currentStep}
        totalSteps={tutorialSteps.length}
        onDismiss={dismissTutorial}
        onNext={nextStep}
        onPrevious={prevStep}
      />
    </div>
  );
}
