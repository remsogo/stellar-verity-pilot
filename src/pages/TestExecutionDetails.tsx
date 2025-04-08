import { MainLayout } from "@/components/Layout/MainLayout";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TestExecutionDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [executionDetails, setExecutionDetails] = useState(null);

  useEffect(() => {
    // Fetch execution details based on the ID
    // Replace this with your actual data fetching logic
    const fetchExecutionDetails = async () => {
      if (id) {
        // Mock data for demonstration
        const mockDetails = {
          id: id,
          testCaseName: "Sample Test Case",
          status: "Passed",
          startTime: new Date().toLocaleTimeString(),
          endTime: new Date().toLocaleTimeString(),
          steps: [
            { id: 1, description: "Step 1: Open the application", result: "Passed" },
            { id: 2, description: "Step 2: Log in", result: "Passed" },
            { id: 3, description: "Step 3: Navigate to dashboard", result: "Passed" },
          ],
        };
        setExecutionDetails(mockDetails);
      }
    };

    fetchExecutionDetails();
  }, [id, router]);

  if (!executionDetails) {
    return <MainLayout
      pageTitle="Execution Details"
      pageDescription="View detailed results of a test execution."
    >
      <div>Loading...</div>
    </MainLayout>;
  }

  return (
    <MainLayout
      pageTitle="Execution Details"
      pageDescription="View detailed results of a test execution."
    >
      <div>
        <h2>Test Case: {executionDetails.testCaseName}</h2>
        <p>Status: {executionDetails.status}</p>
        <p>Start Time: {executionDetails.startTime}</p>
        <p>End Time: {executionDetails.endTime}</p>
        <h3>Steps:</h3>
        <ul>
          {executionDetails.steps.map((step) => (
            <li key={step.id}>
              {step.description} - Result: {step.result}
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default TestExecutionDetails;
