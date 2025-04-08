
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getDefect, updateDefect, deleteDefect } from '@/lib/api/defects';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DefectStatusBadge } from '@/components/Defects/DefectStatusBadge';
import { DefectSeverityBadge } from '@/components/Defects/DefectSeverityBadge';
import { 
  ArrowLeft, 
  Bug, 
  CalendarIcon, 
  ClipboardEdit, 
  LinkIcon, 
  Trash2, 
  UserCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const DefectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: defect, isLoading } = useQuery({
    queryKey: ['defect', id],
    queryFn: () => getDefect(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateDefect(id!, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      queryClient.invalidateQueries({ queryKey: ['defect', id] });
      toast({
        title: 'Status updated',
        description: 'The defect status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteDefectMutation = useMutation({
    mutationFn: () => deleteDefect(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      toast({
        title: 'Defect deleted',
        description: 'The defect has been deleted successfully.',
      });
      navigate('/defects');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete defect: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate(status);
  };

  const handleDelete = () => {
    deleteDefectMutation.mutate();
  };

  if (isLoading) {
    return (
      <MainLayout
        pageTitle="Defect Details"
        pageDescription="Loading defect information..."
      >
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!defect) {
    return (
      <MainLayout
        pageTitle="Defect Not Found"
        pageDescription="The requested defect could not be found."
      >
        <div className="text-center p-12">
          <Bug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Defect Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The defect you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/defects">Back to Defects</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      pageTitle={`Defect: ${defect.title}`}
      pageDescription="View and manage defect details"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/defects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Defects
            </Link>
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to={`/defects/${id}/edit`}>
                <ClipboardEdit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    defect and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{defect.title}</CardTitle>
                    <CardDescription className="mt-2">
                      ID: {defect.id}
                    </CardDescription>
                  </div>
                  <DefectStatusBadge status={defect.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <div className="p-4 bg-muted rounded-md">
                      {defect.description || <span className="text-muted-foreground italic">No description provided</span>}
                    </div>
                  </div>
                  
                  {defect.test_execution_id && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Linked Test Execution</h3>
                      <div className="flex items-center p-3 bg-muted rounded-md">
                        <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Link 
                          to={`/test-execution-details/${defect.test_execution_id}`}
                          className="text-primary hover:underline"
                        >
                          View linked test execution
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <Select 
                    defaultValue={defect.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="reopened">Reopened</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Severity</h4>
                  <div className="py-1">
                    <DefectSeverityBadge severity={defect.severity} />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Reported By</h4>
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{defect.reporter}</span>
                  </div>
                </div>
                
                {defect.assignee && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h4>
                    <div className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{defect.assignee}</span>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(new Date(defect.created_at), 'PPP')}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(new Date(defect.updated_at), 'PPP')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DefectDetails;
