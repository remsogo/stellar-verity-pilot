
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
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          navigate(`/projects/${project.id}`);
        }
      }
    } catch (error: any) {
      console.error('Error submitting project:', error);
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} project`,
        description: error.message || 'An unexpected error occurred',
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
