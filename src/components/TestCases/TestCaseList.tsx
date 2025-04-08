
import { TestCase } from "@/types";
import { TestCaseCard } from "./TestCaseCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TestCaseListProps {
  testCases: TestCase[];
  title?: string;
}

export const TestCaseList = ({ testCases, title = "Recent Test Cases" }: TestCaseListProps) => {
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  // Organize test cases into parent-child structure
  const organizeTestCases = () => {
    const parents: TestCase[] = [];
    const childrenMap: Record<string, TestCase[]> = {};
    const orphans: TestCase[] = [];

    // First pass - categorize all tests
    testCases.forEach((tc: TestCase) => {
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

    // Second pass - assign children to parents
    parents.forEach(parent => {
      if (childrenMap[parent.id]) {
        parent.children = childrenMap[parent.id];
      }
    });

    return [...parents, ...orphans];
  };

  const organizedTestCases = organizeTestCases();

  const handleToggleExpand = (parentId: string) => {
    setExpandedParents(prev => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{testCases.length} test cases</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
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
        <div className="grid grid-cols-1 gap-4">
          {organizedTestCases.map((testCase) => (
            <div key={testCase.id}>
              <div className="flex items-start gap-2">
                {testCase.is_parent && testCase.children && testCase.children.length > 0 ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 mt-1"
                    onClick={() => handleToggleExpand(testCase.id)}
                  >
                    {expandedParents[testCase.id] ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                ) : (
                  <div className="h-6 w-6 flex items-center justify-center mt-1">
                    {testCase.is_parent ? 
                      <Folder className="h-4 w-4 text-primary" /> : 
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                )}
                <div className="flex-1">
                  <TestCaseCard testCase={testCase} showBadge={true} />
                  
                  {/* Render children if parent is expanded */}
                  {testCase.is_parent && expandedParents[testCase.id] && testCase.children && (
                    <div className="ml-6 mt-2 space-y-2">
                      {testCase.children.map(child => (
                        <TestCaseCard key={child.id} testCase={child} isChild={true} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
