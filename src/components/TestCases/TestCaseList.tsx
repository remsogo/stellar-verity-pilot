
import { TestCase } from "@/types";
import { TestCaseCard } from "./TestCaseCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, ChevronRight, ChevronDown, Tag, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestCaseListProps {
  testCases: TestCase[];
  title?: string;
}

export const TestCaseList = ({ testCases, title = "Recent Test Cases" }: TestCaseListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>(testCases);
  const [viewMode, setViewMode] = useState<"list" | "tag">("list");
  
  // Extract all unique tags from test cases
  const allTags = Array.from(
    new Set(testCases.flatMap(tc => tc.tags || []))
  ).sort();

  // Apply filtering based on search query and selected tags
  useEffect(() => {
    let filtered = testCases;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(tc => 
        tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tc.description && tc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(tc => 
        selectedTags.every(tag => tc.tags.includes(tag))
      );
    }
    
    setFilteredTestCases(filtered);
  }, [searchQuery, selectedTags, testCases]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getTestCasesByTag = (tag: string) => {
    return testCases.filter(tc => tc.tags.includes(tag));
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{testCases.length} test cases</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={viewMode === "tag" ? "default" : "outline"} 
            className="h-8"
            onClick={() => setViewMode("tag")}
          >
            <Tag className="h-4 w-4 mr-1" />
            <span>Tags</span>
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "list" ? "default" : "outline"} 
            className="h-8"
            onClick={() => setViewMode("list")}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Link to="/test-cases/new">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search test cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {viewMode === "list" && (
          <>
            {selectedTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1">
                <span className="text-sm text-muted-foreground mr-1">Filtered by:</span>
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => setSelectedTags([])}
                >
                  Clear all
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {filteredTestCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No test cases found matching your criteria
                </div>
              ) : (
                filteredTestCases.map((testCase) => (
                  <div key={testCase.id}>
                    <TestCaseCard testCase={testCase} showTags={true} />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {viewMode === "tag" && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {allTags.map(tag => (
                <TabsTrigger key={tag} value={tag}>{tag}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 gap-4">
                {filteredTestCases.map((testCase) => (
                  <TestCaseCard key={testCase.id} testCase={testCase} showTags={true} />
                ))}
              </div>
            </TabsContent>
            {allTags.map(tag => (
              <TabsContent key={tag} value={tag}>
                <div className="grid grid-cols-1 gap-4">
                  {getTestCasesByTag(tag).map((testCase) => (
                    <TestCaseCard key={testCase.id} testCase={testCase} showTags={true} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
