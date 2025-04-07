
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { TestCase } from "@/types";
import { Filter, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchTestCases = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("test_cases")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching test cases:", error);
          return;
        }

        // Transform database fields to match our frontend TestCase type
        const transformedData = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status as TestCase['status'],
          priority: item.priority as TestCase['priority'],
          author: item.author,
          project_id: item.project_id,
          estimate_time: item.estimate_time,
          automated: item.automated,
          preconditions: item.preconditions,
          requirements: item.requirements,
          tags: item.tags,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // Add these for frontend compatibility
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        setTestCases(transformedData);
        setFilteredTestCases(transformedData);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestCases();
  }, []);

  useEffect(() => {
    filterTestCases(searchQuery, activeTab);
  }, [searchQuery, activeTab, testCases]);

  const filterTestCases = (query: string, tab: string) => {
    let filtered = testCases;

    // Filter by search query
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (testCase) =>
          testCase.title.toLowerCase().includes(query.toLowerCase()) ||
          (testCase.description && testCase.description.toLowerCase().includes(query.toLowerCase())) ||
          testCase.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filter by status
    if (tab !== "all") {
      filtered = filtered.filter((testCase) => testCase.status === tab);
    }

    setFilteredTestCases(filtered);
  };

  // Status counts for badges
  const getStatusCount = (status: string) => {
    return testCases.filter((testCase) => testCase.status === status).length;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Test Cases</h1>
              <p className="text-muted-foreground">
                Create, update, and manage your test cases
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search test cases..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild>
                <Link to="/test-cases/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Test Case
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="all">
                    All <Badge variant="secondary" className="ml-2">{testCases.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="passed">
                    Passed <Badge variant="secondary" className="ml-2">{getStatusCount("passed")}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="failed">
                    Failed <Badge variant="secondary" className="ml-2">{getStatusCount("failed")}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending <Badge variant="secondary" className="ml-2">{getStatusCount("pending")}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="blocked">
                    Blocked <Badge variant="secondary" className="ml-2">{getStatusCount("blocked")}</Badge>
                  </TabsTrigger>
                </TabsList>
                <CardTitle className="text-xl">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Test Cases
                </CardTitle>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTestCases.length > 0 ? (
                <TestCaseList testCases={filteredTestCases} title="" />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No test cases found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default TestCases;
