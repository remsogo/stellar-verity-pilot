
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { getTestPlan, deleteTestPlan } from "@/lib/api";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestPlan } from "@/types/testPlan";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, Edit, Play, CheckCircle, Clock, AlertCircle, Calendar, User, FileText, Tag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TestPlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchTestPlan(id);
    }
  }, [id]);
  
  const fetchTestPlan = async (testPlanId: string) => {
    setIsLoading(true);
    try {
      const data = await getTestPlan(testPlanId);
      setTestPlan(data);
    } catch (error: any) {
      toast({
        title: "Error fetching test plan",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deleteTestPlan(id);
      toast({
        title: "Test plan deleted",
        description: "Test plan has been successfully deleted"
      });
      navigate("/test-plans");
    } catch (error: any) {
      toast({
        title: "Error deleting test plan",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "active":
        return <Play className="h-4 w-4 text-primary" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout pageTitle="Test Plan Details" pageDescription="Loading test plan details...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!testPlan) {
    return (
      <MainLayout pageTitle="Test Plan Details" pageDescription="Test plan not found">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Test Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">The test plan you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/test-plans")}>Back to Test Plans</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      pageTitle="Test Plan Details"
      pageDescription={`Details for test plan: ${testPlan.title}`}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{testPlan.title}</h1>
            <p className="text-muted-foreground">{testPlan.description || "No description provided"}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/test-plans/${id}/edit`}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Link>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases ({testPlan.test_cases?.length || 0})</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(testPlan.status)}
                      <Badge 
                        variant={
                          testPlan.status === "active" ? "default" :
                          testPlan.status === "draft" ? "secondary" :
                          testPlan.status === "completed" ? "outline" :
                          "outline"
                        }
                      >
                        {testPlan.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{testPlan.created_by}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{testPlan.created_at ? format(new Date(testPlan.created_at), "PPP") : "Unknown"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{testPlan.updated_at ? format(new Date(testPlan.updated_at), "PPP") : "Unknown"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="test-cases" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Test Cases</CardTitle>
                  <CardDescription>Test cases included in this test plan</CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link to={`/test-plans/${id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit Test Cases
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {testPlan.test_cases?.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    No test cases added to this test plan yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      This test plan includes {testPlan.test_cases?.length} test cases.
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* This would typically load test case data based on IDs */}
                        {testPlan.test_cases?.map((testCaseId) => (
                          <TableRow key={testCaseId}>
                            <TableCell>{testCaseId.substring(0, 8)}...</TableCell>
                            <TableCell>Unknown</TableCell>
                            <TableCell>Unknown</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/test-cases/${testCaseId}`}>
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="executions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Executions</CardTitle>
                <CardDescription>Test plan execution history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-muted-foreground">
                  No executions for this test plan yet.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  <Play className="h-4 w-4 mr-1" /> Start New Execution
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the test plan "{testPlan.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default TestPlanDetails;
