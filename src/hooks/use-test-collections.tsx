
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TestCollection, TestCase } from '@/types';
import { getTestCollections } from '@/lib/api/testCollections';

export const useTestCollections = (projectId: string | undefined) => {
  const [collections, setCollections] = useState<TestCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      fetchCollections();
    }
  }, [projectId]);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const fetchedCollections = await getTestCollections(projectId || '');
      setCollections(fetchedCollections);
    } catch (error: any) {
      toast({
        title: "Error fetching collections",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter test cases by a given tag
  const filterByTag = (testCases: TestCase[], tag: string): TestCase[] => {
    return testCases.filter(testCase => testCase.tags.includes(tag));
  };

  // Filter test cases by multiple criteria
  const filterByCriteria = (testCases: TestCase[], criteria: Record<string, any>): TestCase[] => {
    return testCases.filter(testCase => {
      for (const [key, value] of Object.entries(criteria)) {
        if (Array.isArray(value)) {
          // If the criterion is an array (like tags), check for any match
          if (Array.isArray(testCase[key as keyof TestCase])) {
            const testCaseValues = testCase[key as keyof TestCase] as any[];
            if (!value.some(v => testCaseValues.includes(v))) {
              return false;
            }
          }
        } else if (testCase[key as keyof TestCase] !== value) {
          return false;
        }
      }
      return true;
    });
  };

  // Create a new collection
  const createCollection = async (collection: Partial<TestCollection>): Promise<void> => {
    // This will be implemented when needed
  };

  // Add test case to collection
  const addTestToCollection = async (collectionId: string, testCaseId: string): Promise<void> => {
    // This will be implemented when needed
  };

  return { 
    collections, 
    isLoading, 
    refreshCollections: fetchCollections,
    filterByTag,
    filterByCriteria,
    createCollection,
    addTestToCollection
  };
};
