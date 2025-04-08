
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

export const ParametersNotificationSettings = () => {
  const handleSave = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure when and how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-test-complete">Test Execution Completed</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails when a test execution is completed
                </p>
              </div>
              <Switch id="email-test-complete" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-defect">New Defect Created</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails when a new defect is created
                </p>
              </div>
              <Switch id="email-defect" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-invite">Project Invitation</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails when you're invited to a project
                </p>
              </div>
              <Switch id="email-invite" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-frequency">Email Digest Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="email-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">In-App Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-test-status-change">Test Status Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when test case status changes
                </p>
              </div>
              <Switch id="app-test-status-change" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-mentions">Mentions</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when someone mentions you in comments
                </p>
              </div>
              <Switch id="app-mentions" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-assignment">Task Assignments</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when you're assigned to a task
                </p>
              </div>
              <Switch id="app-assignment" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
