
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
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DefectsTableProps {
  defects: Defect[];
  isLoading?: boolean;
  limitRows?: number;
}

export const DefectsTable: React.FC<DefectsTableProps> = ({ 
  defects, 
  isLoading = false,
  limitRows
}) => {
  const displayDefects = limitRows ? defects.slice(0, limitRows) : defects;

  if (isLoading) {
    return <div className="text-center p-4">Loading defects...</div>;
  }

  if (!defects || defects.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No defects found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayDefects.map((defect) => (
          <TableRow key={defect.id}>
            <TableCell className="font-medium">{defect.title}</TableCell>
            <TableCell>
              <DefectStatusBadge status={defect.status} />
            </TableCell>
            <TableCell>
              <DefectSeverityBadge severity={defect.severity} />
            </TableCell>
            <TableCell className="text-right">
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
