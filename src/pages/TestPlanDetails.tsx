
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TestPlan } from "@/types/testPlan";
import { TestCase } from "@/types";
import { getTestPlan, deleteTestPlan } from "@/lib/api/testPlans";
import { getTestCase } from "@/lib/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash, AlertCircle, FileText, Play } from "lucide-react";

const TestPlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchTestPlan(id);
    }
  }, [id]);

  const fetchTestPlan = async (planId: string) => {
    setIsLoading(true);
    try {
      const data = await getTestPlan(planId);
      setTestPlan(data);
      
      // Fetch all test cases in the plan
      if (data.test_cases && data.test_cases.length > 0) {
        const testCasePromises = data.test_cases.map(tcId => getTestCase(tcId));
        const fetchedTestCases = await Promise.all(testCasePromises);
        setTestCases(fetchedTestCases);
      }
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
        title: "Success",
        description: "Test plan deleted successfully"
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
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Test Plan Details" pageDescription="Loading...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!testPlan) {
    return (
      <MainLayout pageTitle="Test Plan Details" pageDescription="Test plan not found">
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Test Plan Not Found</h2>
          <p className="mt-2 text-muted-foreground">The test plan you're looking for doesn't exist or has been deleted.</p>
          <Button className="mt-4" onClick={() => navigate("/test-plans")}>Back to Test Plans</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      pageTitle={testPlan.title} 
      pageDescription="Test plan details and management"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{testPlan.title}</h1>
          {testPlan.created_at && (
            <p className="text-sm text-muted-foreground">
              Created {new Date(testPlan.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/test-plans/${id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the test plan. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>
                {testCases.length} test cases included in this plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testCases.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No test cases have been added to this plan yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCases.map(testCase => (
                      <TableRow key={testCase.id}>
                        <TableCell className="font-medium">{testCase.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{testCase.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              testCase.status === "passed" ? "default" :
                              testCase.status === "failed" ? "destructive" :
                              testCase.status === "blocked" ? "secondary" :
                              "outline"
                            }
                          >
                            {testCase.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/test-cases/${testCase.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/test-execution/${testCase.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Play className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Link to={`/test-plans/${id}/edit`}>
                <Button variant="outline" size="sm">
                  Manage Test Cases
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Plan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">
                  <Badge
                    variant={
                      testPlan.status === "active" ? "default" :
                      testPlan.status === "draft" ? "secondary" :
                      testPlan.status === "completed" ? "success" :
                      "outline"
                    }
                  >
                    {testPlan.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testPlan.description || "No description provided"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Test Coverage</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testCases.length} test cases covering {testCases.filter(tc => tc.is_parent).length} parent tests
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="default" size="sm" className="w-full" disabled>
                Execute Test Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestPlanDetails;
