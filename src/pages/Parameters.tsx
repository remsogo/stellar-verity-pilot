
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-user';
import { Sliders, Wrench, Cog, UserCog, Shield, Database, BellRing } from 'lucide-react';
import { ParametersGeneralSettings } from '@/components/Parameters/ParametersGeneralSettings';
import { ParametersNotificationSettings } from '@/components/Parameters/ParametersNotificationSettings';
import { ParametersUserSettings } from '@/components/Parameters/ParametersUserSettings';
import { ParametersSecuritySettings } from '@/components/Parameters/ParametersSecuritySettings';
import { ParametersDatabaseSettings } from '@/components/Parameters/ParametersDatabaseSettings';

const Parameters = () => {
  const { user } = useUser();
  
  return (
    <MainLayout 
      pageTitle="Parameters" 
      pageDescription="Configure system settings and preferences"
    >
      <div className="container py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Database</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="general">
            <ParametersGeneralSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <ParametersNotificationSettings />
          </TabsContent>
          
          <TabsContent value="users">
            <ParametersUserSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <ParametersSecuritySettings />
          </TabsContent>
          
          <TabsContent value="database">
            <ParametersDatabaseSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Parameters;
