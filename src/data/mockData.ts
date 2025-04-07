import { DashboardStat, Status, TestCase, TestExecution, TestTrend } from "@/types";

// Dashboard Stats
export const dashboardStats: DashboardStat[] = [
  {
    label: "Total Test Cases",
    value: 124,
    change: 12,
    status: "positive",
  },
  {
    label: "Passed Tests",
    value: 95,
    change: 8,
    status: "positive",
  },
  {
    label: "Failed Tests",
    value: 15,
    change: -5,
    status: "negative",
  },
  {
    label: "Pending Tests",
    value: 14,
    change: 2,
    status: "neutral",
  },
];

// Test Trends Data
export const testTrends: TestTrend[] = [
  { date: "2023-01-01", passed: 20, failed: 5, pending: 2, blocked: 1 },
  { date: "2023-01-08", passed: 22, failed: 3, pending: 3, blocked: 0 },
  { date: "2023-01-15", passed: 25, failed: 2, pending: 1, blocked: 0 },
  { date: "2023-01-22", passed: 23, failed: 4, pending: 2, blocked: 1 },
  { date: "2023-01-29", passed: 26, failed: 1, pending: 0, blocked: 0 },
  { date: "2023-02-05", passed: 24, failed: 3, pending: 1, blocked: 0 },
  { date: "2023-02-12", passed: 27, failed: 0, pending: 0, blocked: 0 },
];

// Mock Test Cases
export const testCases: TestCase[] = [
  {
    id: "tc-001",
    title: "Login Authentication Test",
    description: "Verify that users can log in with valid credentials and cannot log in with invalid credentials.",
    status: "passed",
    priority: "critical",
    author: "John Doe",
    project_id: "proj-001", // Added project_id
    createdAt: "2023-05-10T14:30:00",
    updatedAt: "2023-05-15T09:45:00",
    steps: [
      {
        id: "step-001",
        description: "Navigate to the login page",
        expectedResult: "Login page is displayed",
        testCaseId: "tc-001",
        order: 1,
      },
      {
        id: "step-002",
        description: "Enter valid username and password",
        expectedResult: "Credentials are accepted",
        testCaseId: "tc-001",
        order: 2,
      },
      {
        id: "step-003",
        description: "Click login button",
        expectedResult: "User is successfully logged in and redirected to dashboard",
        testCaseId: "tc-001",
        order: 3,
      },
    ],
    tags: ["authentication", "security", "ui"],
  },
  {
    id: "tc-002",
    title: "User Registration",
    description: "Verify that new users can successfully register with valid information.",
    status: "failed",
    priority: "high",
    author: "Jane Smith",
    project_id: "proj-001", // Added project_id
    createdAt: "2023-05-08T11:20:00",
    updatedAt: "2023-05-15T10:15:00",
    steps: [
      {
        id: "step-004",
        description: "Navigate to registration page",
        expectedResult: "Registration form is displayed",
        testCaseId: "tc-002",
        order: 1,
      },
      {
        id: "step-005",
        description: "Fill in valid user information",
        expectedResult: "Form accepts the input",
        testCaseId: "tc-002",
        order: 2,
      },
      {
        id: "step-006",
        description: "Submit the registration form",
        expectedResult: "Account is created and confirmation message is shown",
        testCaseId: "tc-002",
        order: 3,
      },
    ],
    tags: ["registration", "user-management", "ui"],
  },
  {
    id: "tc-003",
    title: "Password Reset Functionality",
    description: "Ensure users can reset their password using the password reset feature.",
    status: "pending",
    priority: "medium",
    author: "Alice Johnson",
    project_id: "proj-001", // Added project_id
    createdAt: "2023-05-05T08:00:00",
    updatedAt: "2023-05-15T11:00:00",
    steps: [
      {
        id: "step-007",
        description: "Navigate to the password reset page",
        expectedResult: "Password reset form is displayed",
        testCaseId: "tc-003",
        order: 1,
      },
      {
        id: "step-008",
        description: "Enter registered email address",
        expectedResult: "System accepts the email",
        testCaseId: "tc-003",
        order: 2,
      },
      {
        id: "step-009",
        description: "Submit the password reset request",
        expectedResult: "Email with reset instructions is sent",
        testCaseId: "tc-003",
        order: 3,
      },
    ],
    tags: ["password", "security", "user-management"],
  },
  {
    id: "tc-004",
    title: "Data Export Feature",
    description: "Verify that users can export data in various formats (CSV, Excel).",
    status: "blocked",
    priority: "low",
    author: "Bob Williams",
    project_id: "proj-001", // Added project_id
    createdAt: "2023-05-01T16:45:00",
    updatedAt: "2023-05-15T12:30:00",
    steps: [
      {
        id: "step-010",
        description: "Navigate to the data export page",
        expectedResult: "Data export options are displayed",
        testCaseId: "tc-004",
        order: 1,
      },
      {
        id: "step-011",
        description: "Select the desired data format",
        expectedResult: "Format is selectable",
        testCaseId: "tc-004",
        order: 2,
      },
      {
        id: "step-012",
        description: "Initiate the data export",
        expectedResult: "Data is exported in the selected format",
        testCaseId: "tc-004",
        order: 3,
      },
    ],
    tags: ["data", "export", "reporting"],
  },
  {
    id: "tc-005",
    title: "User Profile Update",
    description: "Ensure users can update their profile information successfully.",
    status: "passed",
    priority: "medium",
    author: "Emily Davis",
    project_id: "proj-001", // Added project_id
    createdAt: "2023-04-28T09:15:00",
    updatedAt: "2023-05-15T13:45:00",
    steps: [
      {
        id: "step-013",
        description: "Navigate to the profile settings page",
        expectedResult: "Profile settings are displayed",
        testCaseId: "tc-005",
        order: 1,
      },
      {
        id: "step-014",
        description: "Modify profile information",
        expectedResult: "Information can be modified",
        testCaseId: "tc-005",
        order: 2,
      },
      {
        id: "step-015",
        description: "Save the changes",
        expectedResult: "Profile information is updated successfully",
        testCaseId: "tc-005",
        order: 3,
      },
    ],
    tags: ["user-management", "profile", "settings"],
  },
];

// Mock Test Executions
export const testExecutions: TestExecution[] = [
  {
    id: "ex-001",
    testCaseId: "tc-001",
    testCase: testCases[0],
    executor: "John Doe",
    status: "passed",
    startTime: "2023-05-15T10:00:00",
    endTime: "2023-05-15T10:15:00",
    environment: "Production",
    notes: "All steps passed successfully.",
    defects: [],
  },
  {
    id: "ex-002",
    testCaseId: "tc-002",
    testCase: testCases[1],
    executor: "Jane Smith",
    status: "failed",
    startTime: "2023-05-15T11:00:00",
    endTime: "2023-05-15T11:20:00",
    environment: "Staging",
    notes: "Step 3 failed due to incorrect error message.",
    defects: ["BUG-001"],
  },
  {
    id: "ex-003",
    testCaseId: "tc-003",
    testCase: testCases[2],
    executor: "Alice Johnson",
    status: "pending",
    startTime: "2023-05-15T12:00:00",
    endTime: "2023-05-15T12:30:00",
    environment: "Development",
    notes: "Awaiting email server setup.",
    defects: [],
  },
];
