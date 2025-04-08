
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { getTestPlans } from "@/lib/api/testPlans";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useToast } from "@/hooks/use-toast";
import { TestPlan } from "@/types/testPlan";
import { TestPlansList } from "@/components/TestPlans/TestPlansList";

const TestPlans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProjectId } = useSelectedProject();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProjectId) {
      fetchTestPlans();
    }
  }, [selectedProjectId]);

  const fetchTestPlans = async () => {
    setIsLoading(true);
    try {
      if (!selectedProjectId) {
        setTestPlans([]);
        return;
      }
      
      const data = await getTestPlans(selectedProjectId);
      setTestPlans(data);
    } catch (error: any) {
      console.error("Error fetching test plans:", error);
      toast({
        title: "Error fetching test plans",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter test plans based on search query
  const filteredTestPlans = testPlans.filter(testPlan => 
    testPlan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (testPlan.description && testPlan.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MainLayout 
      pageTitle="Test Plans" 
      pageDescription="Manage your test plans and create new ones."
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Test Plans</h1>
          <Link to="/test-plans/new">
            <Button className="glass-card hover:bg-primary/80 text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search test plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-card pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TestPlansList testPlans={filteredTestPlans} />
        )}
      </div>
    </MainLayout>
  );
};

export default TestPlans;
