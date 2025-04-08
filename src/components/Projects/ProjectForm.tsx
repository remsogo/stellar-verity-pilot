
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { createProject, updateProject } from '@/lib/api/projects';
import { useUser } from '@/hooks/use-user';
import { AlertCircle } from 'lucide-react';
import { useSelectedProject } from '@/hooks/use-selected-project';

interface ProjectFormProps {
  projectId?: string;
  initialData?: {
    name: string;
    description?: string;
  };
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  projectId, 
  initialData, 
  isEditing = false 
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { refreshProjectSelection } = useSelectedProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      toast({
        title: 'Name is required',
        description: 'Please enter a project name',
        variant: 'destructive',
      });
      return;
    }

    // Ensure user is authenticated
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create or edit projects',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && projectId) {
        await updateProject(projectId, { name, description });
        toast({
          title: 'Project updated',
          description: `Project "${name}" has been updated successfully.`,
        });
        navigate(`/projects/${projectId}`);
      } else {
        const project = await createProject(name, description);
        
        if (project) {
          toast({
            title: 'Project created',
            description: `Project "${name}" has been created successfully.`,
          });
          
          // Refresh project selection to include the new project
          await refreshProjectSelection();
          
          // Navigate to the project page
          navigate(`/projects/${project.id}`);
        }
      }
    } catch (error: any) {
      console.error('Error submitting project:', error);
      
      // Format a more user-friendly error message
      let errorMessage = error.message || 'An unexpected error occurred';
      
      // Handle specific error types for better UX
      if (errorMessage.includes('infinite recursion')) {
        errorMessage = 'There was a database policy error. Please try again later or contact support.';
      }
      
      setError(errorMessage);
      
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} project`,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit' : 'Create'} Project</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your project details below.' 
              : 'Enter the details for your new project.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Project' : 'Create Project')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
