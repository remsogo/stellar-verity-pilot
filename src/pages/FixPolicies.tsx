
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { FixProjectUsersPolicy } from '@/components/FixProjectUsersPolicy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FixPolicies = () => {
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Policy Repair</CardTitle>
            <CardDescription>
              Fix issues with database policies that are causing errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FixProjectUsersPolicy />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FixPolicies;
