
import { FileText, Zap } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestCase } from "@/types";
import { useNavigate } from "react-router-dom";

interface TestCaseInfoCardProps {
  testCase: TestCase;
}

export const TestCaseInfoCard = ({ testCase }: TestCaseInfoCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted/40 border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Test Case Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Priority</div>
            <div className="font-medium mt-0.5 capitalize flex items-center">
              {testCase.priority === "critical" ? (
                <span className="flex items-center text-red-600">
                  <Zap className="h-4 w-4 mr-1.5" fill="currentColor" />
                  Critical
                </span>
              ) : testCase.priority}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Author</div>
            <div className="font-medium mt-0.5">{testCase.author}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Created</div>
            <div className="font-medium mt-0.5">
              {formatDate(testCase.created_at)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="font-medium mt-0.5">
              {formatDate(testCase.updated_at)}
            </div>
          </div>
          {testCase.automated !== undefined && (
            <div>
              <div className="text-sm text-muted-foreground">Automation</div>
              <div className="font-medium mt-0.5 flex items-center">
                {testCase.automated ? (
                  <span className="flex items-center text-blue-600">
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                    Automated
                  </span>
                ) : "Manual"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => navigate(`/test-cases/${testCase.id}`)}
        >
          View Test Case
        </Button>
      </CardFooter>
    </Card>
  );
};
