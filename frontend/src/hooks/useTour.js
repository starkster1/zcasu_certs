import { useState, useEffect } from 'react';

const defaultTourSteps = [
  {
    target: '[data-tour="wallet-connect"]',
    title: 'Connect Your Wallet',
    content: 'Start by connecting your MetaMask wallet to access the platform.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="certificate-verify"]',
    title: 'Verify Certificates',
    content: 'Enter a certificate ID here to instantly verify its authenticity.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="document-list"]',
    title: 'Your Documents',
    content: 'View and manage all your certificates in one place.',
    placement: 'left'
  },
  {
    target: '[data-tour="access-control"]',
    title: 'Access Management',
    content: 'Control who can view your certificates and for how long.',
    placement: 'right'
  }
];

export const useTour = () => {
  const [tourState, setTourState] = useState({
    isActive: false,
    currentStep: 0,
    steps: defaultTourSteps
  });

  const startTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }));
    document.body.style.overflow = 'hidden';
  };

  const endTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
      currentStep: 0
    }));
    document.body.style.overflow = 'auto';
  };

  const nextStep = () => {
    setTourState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        document.body.style.overflow = 'auto';
        return { ...prev, isActive: false, currentStep: 0 };
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  const previousStep = () => {
    setTourState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      startTour();
      localStorage.setItem('hasSeenTour', 'true');
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return {
    ...tourState,
    startTour,
    endTour,
    nextStep,
    previousStep
  };
};
