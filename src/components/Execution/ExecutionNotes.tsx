
import React, { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TestExecution } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExecutionNotesProps {
  notes?: string;
  execution?: TestExecution;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ExecutionNotes: React.FC<ExecutionNotesProps> = ({ notes, execution, onChange }) => {
  const { toast } = useToast();
  const [localNotes, setLocalNotes] = useState(notes || execution?.notes || "");
  
  const handleLocalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };
  
  const handleSaveNotes = () => {
    // In a real app, you would save the notes to the database
    toast({
      title: 'Notes saved',
      description: 'Execution notes have been updated.',
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <h4 className="text-md font-semibold">Execution Notes</h4>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Add notes about this execution..."
          value={onChange ? notes : localNotes}
          onChange={onChange || handleLocalChange}
          className="min-h-24 bg-background"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSaveNotes}>Save Notes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
