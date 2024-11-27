import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useProductTour } from '../hooks/useProductTour';

export default function ProductTour({ role }) {
  const { run, steps, handleTourEnd } = useProductTour(role);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      handleTourEnd();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          primaryColor: '#4F46E5',
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#4F46E5',
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
    />
  );
}
