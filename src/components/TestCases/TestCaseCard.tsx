
import { TestCase, TestCaseStatus } from "@/types";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";

interface TestCaseCardProps {
  testCase: TestCase;
  showTags?: boolean;
}

export const TestCaseCard = ({ testCase, showTags = false }: TestCaseCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {testCase.title}
            </h3>
          </div>
          <CardDescription className="mt-1 line-clamp-2">
            {testCase.description || "No description provided"}
          </CardDescription>
          
          {showTags && testCase.tags && testCase.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {testCase.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge
            variant={
              testCase.status === TestCaseStatus.PASSED ? "default" :
              testCase.status === TestCaseStatus.PENDING ? "secondary" :
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
      </CardFooter>
    </Card>
  );
};
