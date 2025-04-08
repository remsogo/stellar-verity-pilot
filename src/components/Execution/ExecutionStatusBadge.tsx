
import React from 'react';
import { Status, TestCaseStatus } from '@/types';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExecutionStatusBadgeProps {
  status: Status;
}

export const ExecutionStatusBadge: React.FC<ExecutionStatusBadgeProps> = ({ status }) => {
  let icon;
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  
  switch (status) {
    case TestCaseStatus.PASSED:
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'default';
      break;
    case TestCaseStatus.FAILED:
      icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'destructive';
      break;
    case TestCaseStatus.PENDING:
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      variant = 'secondary';
      break;
    case TestCaseStatus.BLOCKED:
      icon = <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      variant = 'outline';
      break;
    default:
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      variant = 'secondary';
  }

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
