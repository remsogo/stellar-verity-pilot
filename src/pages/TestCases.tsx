import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { testCases } from "@/data/mockData";

const TestCases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTestCases, setFilteredTestCases] = useState(testCases);

  useEffect(() => {
    const filtered = testCases.filter((testCase) =>
      testCase.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTestCases(filtered);
  }, [searchQuery]);

  return (
    <MainLayout 
      pageTitle="Test Cases" 
      pageDescription="Manage your test cases and create new ones."
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Test Cases</h1>
          <Link to="/test-cases/new">
            <Button className="glass-card hover:bg-primary/80 text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search test cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your test cases.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestCases.map((testCase) => (
                <TableRow key={testCase.id}>
                  <TableCell className="font-medium">{testCase.id}</TableCell>
                  <TableCell>{testCase.title}</TableCell>
                  <TableCell>{testCase.description}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/test-cases/${testCase.id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestCases;
