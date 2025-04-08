
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bug, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

type DefectStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';

interface DefectStatusBadgeProps {
  status: DefectStatus;
}

export const DefectStatusBadge: React.FC<DefectStatusBadgeProps> = ({ status }) => {
  let icon;
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  
  switch (status) {
    case 'open':
      icon = <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      variant = 'destructive';
      break;
    case 'in-progress':
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      variant = 'secondary';
      break;
    case 'resolved':
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'default';
      break;
    case 'closed':
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'outline';
      break;
    case 'reopened':
      icon = <Bug className="h-3.5 w-3.5 mr-1" />;
      variant = 'destructive';
      break;
    default:
      icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
      variant = 'secondary';
  }

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
