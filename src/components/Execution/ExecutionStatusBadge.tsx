
import React from 'react';
import { Status } from '@/types';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExecutionStatusBadgeProps {
  status: Status;
}

export const ExecutionStatusBadge: React.FC<ExecutionStatusBadgeProps> = ({ status }) => {
  let icon;
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  
  switch (status) {
    case "passed":
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'default';
      break;
    case "failed":
      icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'destructive';
      break;
    case "pending":
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      variant = 'secondary';
      break;
    case "blocked":
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
