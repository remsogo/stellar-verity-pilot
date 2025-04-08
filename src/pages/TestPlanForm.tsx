
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { TestPlanForm } from "@/components/TestPlans/TestPlanForm";
import { TestPlan } from "@/types/testPlan";
import { getTestPlan, createTestPlan, updateTestPlan } from "@/lib/api/testPlans";
import { useToast } from "@/hooks/use-toast";

const TestPlanFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const [testPlan, setTestPlan] = useState<TestPlan | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (data: Partial<TestPlan>) => {
    setIsSubmitting(true);
    try {
      if (id) {
        // Update existing test plan
        await updateTestPlan({ ...data, id });
        toast({
          title: "Success",
          description: "Test plan updated successfully"
        });
      } else {
        // Create new test plan
        await createTestPlan(data);
        toast({
          title: "Success",
          description: "Test plan created successfully"
        });
      }
      navigate("/test-plans");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Test Plan" pageDescription="Loading...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      pageTitle={id ? "Edit Test Plan" : "Create Test Plan"}
      pageDescription={id ? "Update an existing test plan" : "Create a new test plan"}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Test Plan" : "Create Test Plan"}</h1>
      </div>

      <TestPlanForm
        testPlan={testPlan}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </MainLayout>
  );
};

export default TestPlanFormPage;
