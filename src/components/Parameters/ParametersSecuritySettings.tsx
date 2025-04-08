
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';

export const ParametersSecuritySettings = () => {
  const handleSave = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security options for your system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Authentication</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all users
                </p>
              </div>
              <Switch id="two-factor" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attempts">Max Login Attempts</Label>
                <Input id="max-attempts" type="number" defaultValue="5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lockout">Account Lockout</Label>
                <p className="text-sm text-muted-foreground">
                  Lock accounts after failed login attempts
                </p>
              </div>
              <Switch id="lockout" defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Password Policy</h3>
            
            <div className="space-y-2">
              <Label>Minimum Password Strength</Label>
              <div className="pt-2">
                <Slider defaultValue={[3]} max={4} step={1} className="py-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Weak</span>
                  <span>Medium</span>
                  <span>Strong</span>
                  <span>Very Strong</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-length">Minimum Length</Label>
                <Input id="min-length" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue="90" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-special">Require Special Characters</Label>
                <p className="text-sm text-muted-foreground">
                  Passwords must include special characters
                </p>
              </div>
              <Switch id="require-special" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prevent-reuse">Prevent Password Reuse</Label>
                <p className="text-sm text-muted-foreground">
                  Users cannot reuse their previous passwords
                </p>
              </div>
              <Switch id="prevent-reuse" defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Protection</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encryption">Data Encryption</Label>
                <p className="text-sm text-muted-foreground">
                  Encrypt sensitive data in the database
                </p>
              </div>
              <Switch id="encryption" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audit-log">Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Track user activities and system changes
                </p>
              </div>
              <Switch id="audit-log" defaultChecked />
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
