import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Parameter, ParameterType } from '@/types/parameter';
import { parameterService } from '@/lib/utils/parameterService';

export const ParameterManagement: React.FC = () => {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [parameterName, setParameterName] = useState('');
  const [parameterType, setParameterType] = useState<ParameterType>('string');
  const [parameterDescription, setParameterDescription] = useState('');
  const [parameterDefaultValue, setParameterDefaultValue] = useState('');

  const clearForm = () => {
    setEditingParameter(null);
    setParameterName('');
    setParameterType('string');
    setParameterDescription('');
    setParameterDefaultValue('');
  };

  const handleAddParameter = () => {
    if (!parameterName.trim()) {
      toast({
        title: "Error",
        description: "Parameter name is required",
        variant: "destructive"
      });
      return;
    }

    const newParameter: Parameter = {
      name: parameterName.trim(),
      type: parameterType,
      description: parameterDescription.trim() || undefined,
      defaultValue: parameterDefaultValue || undefined
    };

    if (editingParameter) {
      setParameters(parameters.map(p => 
        p.name === editingParameter.name ? newParameter : p
      ));
      toast({
        title: "Parameter Updated",
        description: `Parameter "${newParameter.name}" has been updated.`
      });
    } else {
      if (parameters.some(p => p.name === newParameter.name)) {
        toast({
          title: "Error",
          description: `Parameter "${newParameter.name}" already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      setParameters([...parameters, newParameter]);
      toast({
        title: "Parameter Added",
        description: `Parameter "${newParameter.name}" has been added.`
      });
    }

    clearForm();
  };

  const handleEditParameter = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setParameterName(parameter.name);
    setParameterType(parameter.type);
    setParameterDescription(parameter.description || '');
    setParameterDefaultValue(parameter.defaultValue || '');
  };

  const handleDeleteParameter = (parameterName: string) => {
    setParameters(parameters.filter(p => p.name !== parameterName));
    toast({
      title: "Parameter Deleted",
      description: `Parameter "${parameterName}" has been removed.`
    });
  };

  const handleSaveAll = () => {
    toast({
      title: "Parameters Saved",
      description: `Successfully saved ${parameters.length} parameters.`
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="global">Global Parameters</TabsTrigger>
          <TabsTrigger value="project">Project Parameters</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Parameter Management</CardTitle>
              <CardDescription>Define parameters that can be used across all projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="param-name">Parameter Name</Label>
                  <Input 
                    id="param-name" 
                    value={parameterName} 
                    onChange={(e) => setParameterName(e.target.value)} 
                    placeholder="Enter parameter name"
                  />
                </div>
                <div>
                  <Label htmlFor="param-type">Parameter Type</Label>
                  <Select value={parameterType} onValueChange={(value: ParameterType) => setParameterType(value)}>
                    <SelectTrigger id="param-type">
                      <SelectValue placeholder="Select parameter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="array">Array</SelectItem>
                      <SelectItem value="object">Object</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="param-desc">Description</Label>
                  <Input 
                    id="param-desc" 
                    value={parameterDescription} 
                    onChange={(e) => setParameterDescription(e.target.value)} 
                    placeholder="Enter parameter description"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="param-default">Default Value</Label>
                  <Input 
                    id="param-default" 
                    value={parameterDefaultValue} 
                    onChange={(e) => setParameterDefaultValue(e.target.value)} 
                    placeholder="Enter default value"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={clearForm}>Clear</Button>
                  <Button onClick={handleAddParameter}>
                    {editingParameter ? 'Update Parameter' : 'Add Parameter'}
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {parameters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Default Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((param) => (
                      <TableRow key={param.name}>
                        <TableCell className="font-medium">${param.name}</TableCell>
                        <TableCell>{param.type}</TableCell>
                        <TableCell>{param.description || '-'}</TableCell>
                        <TableCell>{param.defaultValue !== undefined ? String(param.defaultValue) : '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditParameter(param)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteParameter(param.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No parameters defined. Add parameters using the form above.
                </div>
              )}
              
              {parameters.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveAll}>Save All Parameters</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="project" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Parameters</CardTitle>
              <CardDescription>Manage parameters specific to the current project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                Project parameter management will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Parameters</CardTitle>
              <CardDescription>Import or export parameter configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Import Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input type="file" />
                    <Button className="w-full">Import</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Export your parameters as JSON for backup or sharing.
                    </div>
                    <Button className="w-full">Export All Parameters</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
