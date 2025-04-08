
import React, { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TestExecution } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExecutionNotesProps {
  notes: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ExecutionNotes: React.FC<ExecutionNotesProps> = ({ notes, onChange }) => {
  const { toast } = useToast();
  
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
          value={notes}
          onChange={onChange}
          className="min-h-24 bg-background"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSaveNotes}>Save Notes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
