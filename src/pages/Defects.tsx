import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import { DefectsList } from '@/components/Defects/DefectsList';
import { getDefects } from '@/lib/api/defects';
import { Bug, FileBarChart, FilterX, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestCasePriority } from '@/types';

const Defects = () => {
  const { data: defects, isLoading, error } = useQuery({
    queryKey: ['defects'],
    queryFn: getDefects,
  });

  // Calculate counts for each status
  const openCount = defects?.filter(d => d.status === 'open').length || 0;
  const inProgressCount = defects?.filter(d => d.status === 'in-progress').length || 0;
  const resolvedCount = defects?.filter(d => d.status === 'resolved').length || 0;
  const closedCount = defects?.filter(d => d.status === 'closed').length || 0;

  // Calculate counts for each severity
  const criticalCount = defects?.filter(d => d.severity === TestCasePriority.CRITICAL).length || 0;
  const highCount = defects?.filter(d => d.severity === TestCasePriority.HIGH).length || 0;
  const mediumCount = defects?.filter(d => d.severity === TestCasePriority.MEDIUM).length || 0;
  const lowCount = defects?.filter(d => d.severity === TestCasePriority.LOW).length || 0;

  return (
    <MainLayout
      pageTitle="Defects"
      pageDescription="Track and manage defects found during testing"
    >
      <div className="grid gap-6">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openCount}</div>
              <Badge variant="destructive" className="mt-1">
                Needs Attention
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCount}</div>
              <Badge variant="secondary" className="mt-1">
                Being Fixed
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedCount}</div>
              <Badge variant="default" className="mt-1">
                Ready for Verification
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Closed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedCount}</div>
              <Badge variant="outline" className="mt-1">
                Completed
              </Badge>
            </CardContent>
          </Card>
        </div>
        
        {/* Filter and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Input 
              placeholder="Search defects..." 
              className="w-full sm:w-[300px]"
            />
            <Select defaultValue="all-statuses">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="reopened">Reopened</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-severities">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-severities">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/defects/reports">
                <FileBarChart className="h-4 w-4 mr-2" />
                Reports
              </Link>
            </Button>
            <Button className="w-full sm:w-auto" asChild>
              <Link to="/defects/new">
                <Plus className="h-4 w-4 mr-2" />
                New Defect
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">{defects?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="open">
              Open
              <Badge variant="secondary" className="ml-2">{openCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="critical">
              Critical
              <Badge variant="destructive" className="ml-2">{criticalCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high">
              High
              <Badge variant="secondary" className="ml-2">{highCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <DefectsList 
                  defects={defects || []} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="open">
            <Card>
              <CardContent className="p-0">
                <DefectsList 
                  defects={(defects || []).filter(d => d.status === 'open')} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="critical">
            <Card>
              <CardContent className="p-0">
                <DefectsList 
                  defects={(defects || []).filter(d => d.severity === TestCasePriority.CRITICAL)} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="high">
            <Card>
              <CardContent className="p-0">
                <DefectsList 
                  defects={(defects || []).filter(d => d.severity === TestCasePriority.HIGH)} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Defects;
