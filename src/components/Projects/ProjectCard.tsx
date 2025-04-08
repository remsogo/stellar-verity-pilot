
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, UserPlus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onInvite?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  createdAt,
  isSelected = false,
  onSelect,
  onDelete,
  onInvite
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all", 
      isSelected ? "ring-2 ring-primary" : ""
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {name}
          {isSelected && <Check className="h-5 w-5 text-primary" />}
        </CardTitle>
        <CardDescription>
          Created on {format(new Date(createdAt), 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-3 bg-muted/20">
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm" 
          onClick={() => onSelect(id)}
        >
          {isSelected ? "Selected" : "Select Project"}
        </Button>
        <div className="flex gap-2">
          {onInvite && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => onInvite(id)}
            >
              <UserPlus size={16} />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <Link to={`/projects/${id}/edit`}>
              <Pencil size={16} />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
