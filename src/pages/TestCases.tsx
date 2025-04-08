import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, Search, Folder, FileText, ChevronDown } from "lucide-react";
import { testCases } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Badge } from "@/components/ui/badge";
import { TestCase } from "@/types";

const TestCases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [testCasesList, setTestCasesList] = useState<TestCase[]>([]);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProjectId } = useSelectedProject();

  useEffect(() => {
    if (selectedProjectId) {
      fetchTestCases();
    }
  }, [selectedProjectId]);

  const fetchTestCases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .select("*")
        .eq("project_id", selectedProjectId);

      if (error) {
        throw error;
      }

      if (data) {
        const typedData = data as unknown as TestCase[];
        
        const parents: TestCase[] = [];
        const childrenMap: Record<string, TestCase[]> = {};
        const orphans: TestCase[] = [];

        typedData.forEach((tc: TestCase) => {
          if (tc.is_parent) {
            parents.push({...tc, children: []});
          } else if (tc.parent_id) {
            if (!childrenMap[tc.parent_id]) {
              childrenMap[tc.parent_id] = [];
            }
            childrenMap[tc.parent_id].push(tc);
          } else {
            orphans.push(tc);
          }
        });

        parents.forEach(parent => {
          if (childrenMap[parent.id]) {
            parent.children = childrenMap[parent.id];
          }
        });

        setTestCasesList([...parents, ...orphans]);
      }
    } catch (error: any) {
      console.error("Error fetching test cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = (parentId: string) => {
    setExpandedParents(prev => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  const handleSearch = () => {
  };

  const filteredTestCases = testCasesList.filter(testCase => 
    testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (testCase.children && testCase.children.some(child => 
      child.title.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <MainLayout 
      pageTitle="Test Cases" 
      pageDescription="Manage your test cases and create new ones."
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Test Cases</h1>
          <Link to="/test-cases/new">
            <Button className="glass-card hover:bg-primary/80 text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search test cases..."
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
          <div className="rounded-md border">
            <Table>
              <TableCaption>A list of your test cases.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No test cases found. Create your first test case to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestCases.map((testCase) => (
                    <>
                      <TableRow key={testCase.id} className={testCase.is_parent ? "bg-accent/20" : ""}>
                        <TableCell>
                          {testCase.is_parent && testCase.children && testCase.children.length > 0 ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleToggleExpand(testCase.id)}
                            >
                              {expandedParents[testCase.id] ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </Button>
                          ) : (
                            <div className="h-6 w-6 flex items-center justify-center">
                              {testCase.is_parent ? 
                                <Folder className="h-4 w-4 text-primary" /> : 
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              }
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{testCase.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {testCase.title}
                            {testCase.is_parent && (
                              <Badge variant="outline" className="text-xs">
                                Parent
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{testCase.description || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              testCase.status === "Ready" || testCase.status === "passed" ? "default" :
                              testCase.status === "Draft" || testCase.status === "pending" ? "secondary" :
                              "destructive"
                            }
                          >
                            {testCase.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/test-cases/${testCase.id}`}>
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                      {testCase.is_parent && expandedParents[testCase.id] && testCase.children && 
                        testCase.children.map(child => (
                          <TableRow key={`child-${child.id}`} className="bg-muted/10">
                            <TableCell>
                              <div className="h-6 w-6 flex items-center justify-center ml-4">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{child.id.substring(0, 8)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-sm">{child.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{child.description || "—"}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  child.status === "Ready" || child.status === "passed" ? "default" :
                                  child.status === "Draft" || child.status === "pending" ? "secondary" :
                                  "destructive"
                                }
                              >
                                {child.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link to={`/test-cases/${child.id}`}>
                                <Button variant="secondary" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TestCases;
