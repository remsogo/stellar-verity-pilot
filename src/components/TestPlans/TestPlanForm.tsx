
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { TestPlan } from "@/types/testPlan";
import { TestCase } from "@/types";
import { getTestCase } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TestPlanFormProps {
  testPlan?: TestPlan;
  onSubmit: (data: Partial<TestPlan>) => Promise<void>;
  isLoading?: boolean;
}

export const TestPlanForm = ({ testPlan, onSubmit, isLoading = false }: TestPlanFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<TestPlan>>({
    defaultValues: testPlan || {
      title: "",
      description: "",
      status: "draft",
      test_cases: []
    }
  });
  
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>(testPlan?.test_cases || []);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();
  const { selectedProjectId } = useSelectedProject();
  
  useEffect(() => {
    // Whenever selectedTestCases changes, update the form value
    setValue("test_cases", selectedTestCases);
  }, [selectedTestCases, setValue]);
  
  const handleFormSubmit = async (data: Partial<TestPlan>) => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a test plan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Set project ID and created_by from context
      data.project_id = selectedProjectId;
      data.created_by = user.id;
      data.test_cases = selectedTestCases;
      
      await onSubmit(data);
    } catch (error: any) {
      toast({
        title: "Error submitting form",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const toggleTestCase = (testCaseId: string) => {
    setSelectedTestCases(prev => {
      if (prev.includes(testCaseId)) {
        return prev.filter(id => id !== testCaseId);
      } else {
        return [...prev, testCaseId];
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{testPlan ? "Edit Test Plan" : "Create Test Plan"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Test Plan Title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this test plan"
                {...register("description")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={testPlan?.status || "draft"}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select test cases to include in this test plan. You can add or remove test cases later.
            </p>
            
            {isLoadingTestCases ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              availableTestCases.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableTestCases.map(testCase => (
                      <TableRow key={testCase.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTestCases.includes(testCase.id)}
                            onCheckedChange={() => toggleTestCase(testCase.id)}
                          />
                        </TableCell>
                        <TableCell>{testCase.title}</TableCell>
                        <TableCell>{testCase.priority}</TableCell>
                        <TableCell>{testCase.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No test cases available. Create test cases first to add them to this plan.
                </div>
              )
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current"></div>
                Saving...
              </>
            ) : testPlan ? "Update Test Plan" : "Create Test Plan"}
          </Button>
        </div>
      </div>
    </form>
  );
};
