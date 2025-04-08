
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTestExecutions } from '@/lib/api/testExecutions';
import { getTestCasesByProject } from '@/lib/api/testCases';
import { DashboardStat, TestTrend } from "@/types";

export const useDashboardStats = (projectId: string | null) => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [trends, setTrends] = useState<TestTrend[]>([]);

  // Fetch test cases
  const { data: testCases, isLoading: isTestCasesLoading } = useQuery({
    queryKey: ['testCases', projectId],
    queryFn: () => projectId ? getTestCasesByProject(projectId) : Promise.resolve([]),
    enabled: !!projectId
  });
  
  // Fetch test executions
  const { data: executions, isLoading: isExecutionsLoading } = useQuery({
    queryKey: ['testExecutions', projectId],
    queryFn: () => projectId ? getTestExecutions(projectId) : Promise.resolve([]),
    enabled: !!projectId
  });

  // Calculate stats and trends when data is available
  useEffect(() => {
    if (!isTestCasesLoading && !isExecutionsLoading && testCases && executions) {
      calculateStats(testCases, executions);
      generateTrends(executions);
    }
  }, [testCases, executions, isTestCasesLoading, isExecutionsLoading]);

  // Calculate dashboard statistics
  const calculateStats = (testCases: any[], executions: any[]) => {
    // Get latest executions to avoid counting the same test case multiple times
    const latestExecutions = executions.reduce((acc: any, execution: any) => {
      if (!acc[execution.test_case_id] || new Date(execution.created_at) > new Date(acc[execution.test_case_id].created_at)) {
        acc[execution.test_case_id] = execution;
      }
      return acc;
    }, {});
    
    const latestExecutionValues = Object.values(latestExecutions) as any[];
    
    // Count executions by status
    const passedTests = latestExecutionValues.filter(exe => exe.status === 'passed').length;
    const failedTests = latestExecutionValues.filter(exe => exe.status === 'failed').length;
    
    // Calculate test coverage (percentage of test cases with executions)
    const executedTestCaseIds = new Set(executions.map(exe => exe.test_case_id));
    const coverage = testCases.length > 0 
      ? Math.round((executedTestCaseIds.size / testCases.length) * 100) 
      : 0;
    
    // Calculate average execution time (dummy calculation)
    const avgTime = executions.length > 0 
      ? Math.round(executions.reduce((sum, exe) => {
          const start = new Date(exe.start_time).getTime();
          const end = exe.end_time ? new Date(exe.end_time).getTime() : start + 300000; // Default 5 min if no end time
          return sum + (end - start) / 60000; // Convert to minutes
        }, 0) / executions.length) 
      : 0;
    
    // Create stats array
    setStats([
      {
        label: 'Test Cases',
        value: testCases.length,
        change: 5, // Placeholder for now
        status: 'positive'
      },
      {
        label: 'Pass Rate',
        value: latestExecutionValues.length > 0 
          ? Math.round((passedTests / latestExecutionValues.length) * 100) 
          : 0,
        change: 2, // Placeholder
        status: 'positive'
      },
      {
        label: 'Coverage',
        value: coverage,
        change: 8, // Placeholder
        status: 'positive'
      },
      {
        label: 'Avg. Time',
        value: avgTime,
        change: 0, // Placeholder
        status: 'neutral'
      }
    ]);
  };

  // Generate trend data
  const generateTrends = (executions: any[]) => {
    if (!executions || executions.length === 0) {
      setTrends([]);
      return;
    }

    // Group executions by date
    const executionsByDate = executions.reduce((acc: any, execution: any) => {
      const date = new Date(execution.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          passed: 0,
          failed: 0,
          pending: 0,
          blocked: 0
        };
      }
      
      acc[date][execution.status] += 1;
      return acc;
    }, {});

    // Convert to array and sort by date
    const trendData = Object.values(executionsByDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Ensure we have at least 7 data points
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!executionsByDate[dateStr]) {
        last7Days.push({
          date: dateStr,
          passed: 0,
          failed: 0,
          pending: 0,
          blocked: 0
        });
      } else {
        last7Days.push(executionsByDate[dateStr]);
      }
    }

    setTrends(last7Days);
  };

  return {
    stats,
    trends,
    isLoading: isTestCasesLoading || isExecutionsLoading
  };
};
