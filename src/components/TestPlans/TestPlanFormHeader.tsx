
import React from "react";
import { useFormContext } from "react-hook-form";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestPlan } from "@/types/testPlan";

interface TestPlanFormHeaderProps {
  isEditing: boolean;
}

export const TestPlanFormHeader: React.FC<TestPlanFormHeaderProps> = ({ isEditing }) => {
  const { register, formState: { errors }, setValue } = useFormContext<Partial<TestPlan>>();

  return (
    <>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Test Plan" : "Create Test Plan"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Test Plan Title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the purpose of this test plan"
            {...register("description")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue="draft"
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </>
  );
};
