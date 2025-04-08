
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestCase, TestCasePriority } from '@/types';
import { Calendar, Clock, Tag, FileText } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface TestCaseInfoCardProps {
  testCase: TestCase;
}

export const TestCaseInfoCard: React.FC<TestCaseInfoCardProps> = ({ testCase }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Test Case Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Priority</h4>
          <div className="flex items-center">
            <Badge variant={
              testCase.priority === TestCasePriority.CRITICAL ? 'destructive' :
              testCase.priority === TestCasePriority.HIGH ? 'destructive' :
              testCase.priority === TestCasePriority.MEDIUM ? 'default' :
              'secondary'
            }>
              {testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
            </Badge>
          </div>
        </div>
        
        {testCase.estimate_time && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Estimated Time</h4>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{testCase.estimate_time} min</span>
            </div>
          </div>
        )}
        
        {testCase.created_at && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{new Date(testCase.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
        
        {testCase.preconditions && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Preconditions</h4>
            <p className="text-sm">{testCase.preconditions}</p>
          </div>
        )}
        
        {testCase.tags && testCase.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {testCase.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Author</h4>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{testCase.author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
