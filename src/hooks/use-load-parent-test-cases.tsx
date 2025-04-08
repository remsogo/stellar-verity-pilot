
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useLoadParentTestCases = (projectId: string | undefined) => {
  const [parentTestCases, setParentTestCases] = useState<Array<{ id: string; title: string }>>([]);
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
      const { data, error } = await supabase
        .from("test_cases")
        .select("id, title")
        .eq("project_id", projectId)
        .eq("is_parent", true);

      if (error) {
        throw error;
      }

      if (data) {
        setParentTestCases(data);
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
