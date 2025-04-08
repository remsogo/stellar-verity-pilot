
import React from 'react';
import { Link } from 'react-router-dom';
import { Defect } from '@/types';
import { DefectStatusBadge } from './DefectStatusBadge';
import { DefectSeverityBadge } from './DefectSeverityBadge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  Clock,
  LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface DefectsListProps {
  defects: Defect[];
  isLoading?: boolean;
}

export const DefectsList: React.FC<DefectsListProps> = ({ defects, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Clock className="h-12 w-12 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading defects...</p>
        </div>
      </div>
    );
  }

  if (!defects || defects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-card">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No defects found</p>
          <Button variant="outline" asChild>
            <Link to="/defects/new">Create a defect</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Reported by</TableHead>
          <TableHead>Assigned to</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defects.map((defect) => (
          <TableRow key={defect.id}>
            <TableCell className="font-mono text-xs">
              {defect.id.split('-')[0]}
            </TableCell>
            <TableCell className="font-medium">
              {defect.title}
              {defect.test_execution_id && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  <span>Linked to execution</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <DefectStatusBadge status={defect.status} />
            </TableCell>
            <TableCell>
              <DefectSeverityBadge severity={defect.severity} />
            </TableCell>
            <TableCell className="text-sm">{defect.reporter}</TableCell>
            <TableCell className="text-sm">{defect.assignee || '—'}</TableCell>
            <TableCell className="text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(defect.created_at), { addSuffix: true })}</span>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/defects/${defect.id}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
