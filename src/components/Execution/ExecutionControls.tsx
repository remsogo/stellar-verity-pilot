
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExecutionControlsProps {
  isSaving: boolean;
  isCompleted: boolean;
  onSave: () => void;
  onComplete: () => void;
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  isSaving,
  isCompleted,
  onSave,
  onComplete
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <>
            Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Save"
        )}
      </Button>
      <Button onClick={onComplete} disabled={isSaving || !isCompleted}>
        {isSaving ? (
          <>
            Completing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Complete Execution"
        )}
      </Button>
    </div>
  );
};
