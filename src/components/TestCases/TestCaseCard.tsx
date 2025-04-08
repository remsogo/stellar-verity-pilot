
import { TestCase } from "@/types";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Folder } from "lucide-react";

interface TestCaseCardProps {
  testCase: TestCase;
  isChild?: boolean;
  showBadge?: boolean;
}

export const TestCaseCard = ({ testCase, isChild = false, showBadge = false }: TestCaseCardProps) => {
  return (
    <Card className={`p-4 ${isChild ? 'border-l-4 border-l-primary/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {testCase.title}
            </h3>
            {showBadge && testCase.is_parent && (
              <Badge variant="outline" className="text-xs">
                Parent
              </Badge>
            )}
          </div>
          <CardDescription className="mt-1 line-clamp-2">
            {testCase.description || "No description provided"}
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge
            variant={
              testCase.status === "ready" ? "default" :
              testCase.status === "draft" ? "secondary" :
              "destructive"
            }
          >
            {testCase.status}
          </Badge>
          
          <Link to={`/test-cases/${testCase.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <CardFooter className="px-0 pt-2 pb-0 flex gap-2 text-xs text-muted-foreground">
        <span>ID: {testCase.id.substring(0, 8)}</span>
        <span>•</span>
        <span>Priority: {testCase.priority}</span>
        {testCase.is_parent && testCase.children && (
          <>
            <span>•</span>
            <span>Child Tests: {testCase.children.length}</span>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
