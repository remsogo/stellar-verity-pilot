
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ExecutionNotesProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ExecutionNotes: React.FC<ExecutionNotesProps> = ({ notes, onChange }) => {
  return (
    <Card className="card-futuristic">
      <CardHeader>
        <h4 className="text-md font-semibold">Execution Notes</h4>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add notes about this execution..."
          value={notes}
          onChange={onChange}
          className="bg-background"
        />
      </CardContent>
    </Card>
  );
};
