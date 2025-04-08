
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestExecution, TestCase } from "@/types";
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Eye, 
  FileText, 
  ArrowDown,
  ArrowUp
} from "lucide-react";

const TestExecutions = () => {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<TestExecution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>("start_time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchExecutions();
  }, [sortField, sortDirection]);

  const fetchExecutions = async () => {
    setIsLoading(true);
    try {
      // First get all test executions
      const { data: executionsData, error: executionsError } = await supabase
        .from("test_executions")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (executionsError) {
        throw executionsError;
      }

      if (!executionsData || executionsData.length === 0) {
        setExecutions([]);
        setIsLoading(false);
        return;
      }

      // Get the test case details for all executions
      const testCaseIds = [...new Set(executionsData.map(execution => execution.test_case_id))];
      
      const { data: testCasesData, error: testCasesError } = await supabase
        .from("test_cases")
        .select("*")
        .in("id", testCaseIds);
        
      if (testCasesError) {
        throw testCasesError;
      }

      // Map test cases to executions
      const testCasesMap: Record<string, TestCase> = {};
      testCasesData?.forEach(testCase => {
        testCasesMap[testCase.id] = {
          id: testCase.id,
          title: testCase.title,
          description: testCase.description,
          status: testCase.status,
          priority: testCase.priority,
          author: testCase.author,
          project_id: testCase.project_id,
          automated: testCase.automated,
          tags: testCase.tags || [],
          requirements: testCase.requirements || [],
          estimate_time: testCase.estimate_time,
          preconditions: testCase.preconditions,
          created_at: testCase.created_at,
          updated_at: testCase.updated_at
        };
      });

      // Create the combined data
      const mappedExecutions: TestExecution[] = executionsData.map(execution => ({
        id: execution.id,
        testCaseId: execution.test_case_id,
        testCase: testCasesMap[execution.test_case_id],
        executor: execution.executor,
        status: execution.status,
        startTime: execution.start_time,
        endTime: execution.end_time || execution.start_time,
        environment: execution.environment,
        notes: execution.notes || "",
        defects: execution.defects || []
      }));

      setExecutions(mappedExecutions);
    } catch (error) {
      console.error("Error fetching test executions:", error);
      toast.error("Failed to load test executions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    
    // If it's less than a minute
    if (diffMs < 60000) {
      return `${Math.round(diffMs / 1000)}s`;
    }
    
    // If it's less than an hour
    if (diffMs < 3600000) {
      return `${Math.floor(diffMs / 60000)}m ${Math.floor((diffMs % 60000) / 1000)}s`;
    }
    
    // Hours and minutes
    return `${Math.floor(diffMs / 3600000)}h ${Math.floor((diffMs % 3600000) / 60000)}m`;
  };

  const filteredExecutions = executions.filter((execution) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      execution.testCase?.title.toLowerCase().includes(searchLower) ||
      execution.executor.toLowerCase().includes(searchLower) ||
      execution.environment.toLowerCase().includes(searchLower) ||
      execution.status.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    let className = "bg-gray-100 text-gray-800";
    
    switch (status) {
      case "passed":
        className = "bg-green-100 text-green-800";
        break;
      case "failed":
        className = "bg-red-100 text-red-800";
        break;
      case "blocked":
        className = "bg-amber-100 text-amber-800";
        break;
      case "pending":
        className = "bg-blue-100 text-blue-800";
        break;
      default:
        break;
    }
    
    return (
      <Badge className={className}>
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Test Executions</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search executions..."
                    className="w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => navigate("/test-cases")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Test Cases
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Loading executions...</div>
              </div>
            ) : filteredExecutions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-4">No test executions found</div>
                <Button onClick={() => navigate("/test-cases")}>
                  Go to Test Cases
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="w-[300px] cursor-pointer"
                        onClick={() => handleSortChange("test_case_id")}
                      >
                        <div className="flex items-center">
                          Test Case {getSortIcon("test_case_id")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSortChange("status")}
                      >
                        <div className="flex items-center">
                          Status {getSortIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSortChange("executor")}
                      >
                        <div className="flex items-center">
                          Executor {getSortIcon("executor")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSortChange("environment")}
                      >
                        <div className="flex items-center">
                          Environment {getSortIcon("environment")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSortChange("start_time")}
                      >
                        <div className="flex items-center">
                          Date {getSortIcon("start_time")}
                        </div>
                      </TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.map((execution) => (
                      <TableRow key={execution.id} className="group">
                        <TableCell>
                          <div className="font-medium">{execution.testCase?.title}</div>
                          <div className="flex gap-1 mt-1">
                            {execution.testCase?.tags?.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {(execution.testCase?.tags?.length || 0) > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{(execution.testCase?.tags?.length || 0) - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(execution.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {execution.executor}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{execution.environment}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            {formatDate(execution.startTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            {calculateDuration(execution.startTime, execution.endTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hidden group-hover:flex"
                            onClick={() => navigate(`/test-execution-details/${execution.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestExecutions;
