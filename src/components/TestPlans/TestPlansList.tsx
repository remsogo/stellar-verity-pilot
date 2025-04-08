
import { TestPlan } from "@/types/testPlan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TestPlansListProps {
  testPlans: TestPlan[];
}

export const TestPlansList = ({ testPlans }: TestPlansListProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Test Plans</CardTitle>
          <CardDescription>{testPlans.length} test plans</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Link to="/test-plans/new">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {testPlans.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No test plans found. Create your first test plan to get started.
            </div>
          ) : (
            testPlans.map((testPlan) => (
              <Link to={`/test-plans/${testPlan.id}`} key={testPlan.id} className="block">
                <Card className="p-4 hover:bg-accent/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{testPlan.title}</h3>
                      <CardDescription className="mt-1 line-clamp-2">
                        {testPlan.description || "No description provided"}
                      </CardDescription>
                      <div className="mt-2 text-xs text-muted-foreground flex gap-2">
                        <span>Test Cases: {testPlan.test_cases.length}</span>
                        {testPlan.created_at && (
                          <>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(testPlan.created_at), { addSuffix: true })}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          testPlan.status === "active" ? "default" :
                          testPlan.status === "draft" ? "secondary" :
                          testPlan.status === "completed" ? "outline" :
                          "outline"
                        }
                      >
                        {testPlan.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
