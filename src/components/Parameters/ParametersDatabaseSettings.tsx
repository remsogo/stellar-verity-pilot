
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Database, Download, HardDrive, Upload } from 'lucide-react';

export const ParametersDatabaseSettings = () => {
  const handleSave = () => {
    toast({
      title: "Database settings saved",
      description: "Your database settings have been updated successfully."
    });
  };
  
  const handleBackup = () => {
    toast({
      title: "Backup initiated",
      description: "Your database backup is being created. You'll be notified when it's ready."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Settings</CardTitle>
          <CardDescription>Configure database connection and maintenance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Database Status</h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Storage Usage</div>
              <Progress value={45} className="h-2 w-32" />
              <div className="mt-1 text-xs text-muted-foreground">45% of 2GB</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" defaultValue="cdajoyxeulwixtvnrlqd.supabase.co" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" defaultValue="postgres" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Database Port</Label>
              <Input id="db-port" defaultValue="5432" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-ssl">SSL Mode</Label>
              <Select defaultValue="require">
                <SelectTrigger id="db-ssl">
                  <SelectValue placeholder="Select SSL mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="require">Require</SelectItem>
                  <SelectItem value="prefer">Prefer</SelectItem>
                  <SelectItem value="disable">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Maintenance Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">
                  Create database backups automatically
                </p>
              </div>
              <Switch id="auto-backup" defaultChecked />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cleanup-logs">Auto-cleanup Logs</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically clean up old database logs
                </p>
              </div>
              <Switch id="cleanup-logs" defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button variant="outline" className="h-auto py-4 gap-3 flex-col items-center justify-center" onClick={handleBackup}>
                <Download className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Backup Database</div>
                  <div className="text-xs text-muted-foreground">Create a full database backup</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 gap-3 flex-col items-center justify-center">
                <Upload className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Restore Database</div>
                  <div className="text-xs text-muted-foreground">Restore from a backup file</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Database Maintenance Mode</h3>
              <p className="text-sm text-amber-700 mt-1">
                Enabling maintenance mode will make the database read-only for all users until disabled.
                Only use this feature when performing critical database operations.
              </p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" className="bg-white text-amber-800 border-amber-300">
                  Enable Maintenance Mode
                </Button>
              </div>
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
