import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export const TourOverlay = ({
  step,
  totalSteps,
  currentStep,
  onNext,
  onPrevious,
  onClose,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef(null);

  useEffect(() => {
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const top = rect.top + scrollTop;
      const left = rect.left + scrollLeft;

      setPosition({ top, left });

      // Calculate tooltip position
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const placement = step.placement || 'bottom';

        let tooltipTop = top;
        let tooltipLeft = left;

        switch (placement) {
          case 'top':
            tooltipTop = top - tooltipRect.height - 10;
            tooltipLeft = left + (rect.width - tooltipRect.width) / 2;
            break;
          case 'bottom':
            tooltipTop = top + rect.height + 10;
            tooltipLeft = left + (rect.width - tooltipRect.width) / 2;
            break;
          case 'left':
            tooltipTop = top + (rect.height - tooltipRect.height) / 2;
            tooltipLeft = left - tooltipRect.width - 10;
            break;
          case 'right':
            tooltipTop = top + (rect.height - tooltipRect.height) / 2;
            tooltipLeft = left + rect.width + 10;
            break;
        }

        setTooltipStyle({
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        });
      }
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Highlight target element */}
      <div
        className="absolute border-2 border-indigo-500 rounded-lg shadow-lg pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          width: document.querySelector(step.target)?.getBoundingClientRect().width,
          height: document.querySelector(step.target)?.getBoundingClientRect().height,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-lg shadow-xl p-4 w-80"
        style={tooltipStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{step.content}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrevious}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={onNext}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              {currentStep !== totalSteps - 1 && <ChevronRight className="h-5 w-5 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
