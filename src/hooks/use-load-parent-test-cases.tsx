
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

/**
 * Simple type definition for parent test cases
 * Explicitly avoiding references to TestCase to prevent circular references
 */
type ParentTestCase = {
  id: string;
  title: string;
};

export const useLoadParentTestCases = (projectId: string | undefined) => {
  const [parentTestCases, setParentTestCases] = useState<ParentTestCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      fetchParentTestCases();
    }
  }, [projectId]);

  const fetchParentTestCases = async () => {
    setIsLoading(true);
    try {
      // Explicitly specify the return type
      const { data, error } = await supabase
        .from("test_cases")
        .select("id, title")
        .eq("project_id", projectId)
        .eq("is_parent", true);

      if (error) {
        throw error;
      }

      // Explicitly cast the data to avoid deep type inference
      if (data) {
        setParentTestCases(data as ParentTestCase[]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching parent test cases",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { parentTestCases, isLoading };
};
