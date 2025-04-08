
import React from 'react';

export const ExecutionDetailsLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-muted rounded-full mb-4 animate-spin"></div>
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-3 w-40 bg-muted/60 rounded"></div>
        </div>
      </div>
    </div>
  );
};
