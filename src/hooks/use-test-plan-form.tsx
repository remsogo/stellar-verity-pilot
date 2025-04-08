
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { TestPlan } from "@/types/testPlan";
import { TestCase } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useTestPlanForm = (
  testPlan?: TestPlan,
  onSubmit: (data: Partial<TestPlan>) => Promise<void>
) => {
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>(testPlan?.test_cases || []);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();
  const { selectedProjectId } = useSelectedProject();
  
  const methods = useForm<Partial<TestPlan>>({
    defaultValues: testPlan || {
      title: "",
      description: "",
      status: "draft",
      test_cases: []
    }
  });
  
  useEffect(() => {
    if (selectedProjectId) {
      fetchAvailableTestCases();
    }
  }, [selectedProjectId]);
  
  useEffect(() => {
    // Whenever selectedTestCases changes, update the form value
    methods.setValue("test_cases", selectedTestCases);
  }, [selectedTestCases]);
  
  const fetchAvailableTestCases = async () => {
    if (!selectedProjectId) return;
    
    setIsLoadingTestCases(true);
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .select("*")
        .eq("project_id", selectedProjectId);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setAvailableTestCases(data as unknown as TestCase[]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching test cases",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingTestCases(false);
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
    
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    methods,
    selectedTestCases,
    availableTestCases,
    isLoadingTestCases,
    isSubmitting,
    toggleTestCase,
    handleFormSubmit
  };
};
