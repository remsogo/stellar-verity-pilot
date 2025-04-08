
import { Separator } from "@/components/ui/separator";
import { ExecutionStatusBadge } from "./ExecutionStatusBadge";
import { ExecutionStep } from "@/types";

interface ExecutionStepCardProps {
  step: ExecutionStep;
}

export const ExecutionStepCard = ({ step }: ExecutionStepCardProps) => {
  return (
    <div className="border rounded-md p-4 transition-all hover:shadow-md hover:bg-muted/20 group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium flex items-center">
          <span className="flex items-center justify-center bg-primary/10 w-6 h-6 rounded-full mr-2 text-xs font-bold text-primary">
            {step.step_order}
          </span>
          Step {step.step_order}
        </h4>
        <ExecutionStatusBadge status={step.status} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-1">Description</h5>
          <p className="text-sm">{step.description}</p>
        </div>
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-1">Expected Result</h5>
          <p className="text-sm">{step.expected_result}</p>
        </div>
        {step.actual_result && (
          <div className="md:col-span-2">
            <h5 className="text-sm font-medium text-muted-foreground mb-1">Actual Result</h5>
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              {step.actual_result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
