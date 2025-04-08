
import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Tag } from "lucide-react";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseTagsProps {
  control: Control<TestCaseFormValues>;
  isLoading: boolean;
}

export const TestCaseTags: React.FC<TestCaseTagsProps> = ({
  control,
  isLoading,
}) => {
  const [tagInput, setTagInput] = useState("");

  return (
    <div className="bg-muted/50 p-4 rounded-md space-y-4">
      <h3 className="text-md font-medium">Tags</h3>
      
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                disabled={isLoading}
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    const newTags = [...field.value];
                    if (!newTags.includes(tagInput.trim())) {
                      newTags.push(tagInput.trim());
                      field.onChange(newTags);
                    }
                    setTagInput("");
                  }
                }}
              />
              <Button 
                type="button"
                size="sm"
                variant="outline"
                disabled={isLoading || !tagInput.trim()}
                onClick={() => {
                  if (tagInput.trim()) {
                    const newTags = [...field.value];
                    if (!newTags.includes(tagInput.trim())) {
                      newTags.push(tagInput.trim());
                      field.onChange(newTags);
                    }
                    setTagInput("");
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {field.value && field.value.length > 0 ? (
                field.value.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => {
                        const newTags = [...field.value];
                        newTags.splice(index, 1);
                        field.onChange(newTags);
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No tags added yet</div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Tags help organize and filter test cases. Press Enter or click Add to create a tag.
            </div>
          </div>
        )}
      />
    </div>
  );
};
