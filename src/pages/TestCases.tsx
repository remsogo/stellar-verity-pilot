
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
import { ChevronRight, Plus, Search, Folder, FileText, Tag, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Badge } from "@/components/ui/badge";
import { TestCase, TestCaseStatus } from "@/types";
import { mapDbTestCaseToTestCase } from "@/lib/api/testCaseMappers";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const TestCases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [testCasesList, setTestCasesList] = useState<TestCase[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
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
        const typedData = data.map(item => mapDbTestCaseToTestCase(item as any));
        setTestCasesList(typedData);
        
        // Extract all unique tags
        const tagsSet = new Set<string>();
        typedData.forEach(tc => {
          if (tc.tags && tc.tags.length > 0) {
            tc.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet).sort());
      }
    } catch (error: any) {
      console.error("Error fetching test cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Function will be implemented when needed
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredTestCases = testCasesList.filter(testCase => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === "" || 
      testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (testCase.description && testCase.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply tag filter
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => testCase.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

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

        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search test cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-card pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Tags</span>
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-2 text-muted-foreground" />
                      {tag}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">No tags available</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        {selectedTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            <span className="text-sm text-muted-foreground mr-1">Filtered by:</span>
            {selectedTags.map(tag => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => toggleTag(tag)}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

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
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No test cases found. Create your first test case to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell>
                        <div className="h-6 w-6 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{testCase.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {testCase.title}
                        </div>
                      </TableCell>
                      <TableCell>{testCase.description || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            testCase.status === TestCaseStatus.PASSED || testCase.status === TestCaseStatus.READY ? "default" :
                            testCase.status === TestCaseStatus.PENDING || testCase.status === TestCaseStatus.DRAFT ? "secondary" :
                            "destructive"
                          }
                        >
                          {testCase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {testCase.tags && testCase.tags.length > 0 ? (
                            testCase.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No tags</span>
                          )}
                          {testCase.tags && testCase.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{testCase.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/test-cases/${testCase.id}`}>
                          <Button variant="secondary" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
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
