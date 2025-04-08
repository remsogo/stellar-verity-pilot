
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Status } from "@/types";

interface ExecutionStatusBadgeProps {
  status: Status;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ExecutionStatusBadge = ({ 
  status, 
  showIcon = true,
  size = "md" 
}: ExecutionStatusBadgeProps) => {
  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const sizeClass = size === "sm" 
    ? "text-xs py-0 px-2"
    : size === "lg" 
      ? "text-sm py-1.5 px-3"
      : "py-1 px-2.5";

  return (
    <Badge 
      className={`${
        status === "passed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
        status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
        status === "blocked" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      } ${sizeClass} font-medium`}
    >
      <div className="flex items-center">
        {showIcon && (
          <span className="mr-1.5">{getStatusIcon(status)}</span>
        )}
        <span className="capitalize">{status}</span>
      </div>
    </Badge>
  );
};
