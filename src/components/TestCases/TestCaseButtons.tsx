
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TestCaseButtonsProps {
  isLoading: boolean;
}

export const TestCaseButtons: React.FC<TestCaseButtonsProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" onClick={() => navigate("/test-cases")}>Cancel</Button>
      <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
    </div>
  );
};
