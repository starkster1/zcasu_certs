import React from 'react';
import { useTour } from '../hooks/useTour';
import { TourOverlay } from './TourOverlay';
import { HelpCircle } from 'lucide-react';
import './TourProvider.css';

export const TourProvider = ({ children }) => {
  const { isActive, currentStep, steps, startTour, endTour, nextStep, previousStep } = useTour();

  return (
    <>
      {children}

      {isActive && (
        <TourOverlay
          step={steps[currentStep]}
          totalSteps={steps.length}
          currentStep={currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onClose={endTour}
        />
      )}

        <button
          onClick={startTour}
          className="tour-button"
          title="Start Tour"
        >
          <HelpCircle className="help-icon" />
        </button>

    </>
  );
};
