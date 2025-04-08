
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTrend } from "@/types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TestsChartProps {
  data: TestTrend[];
}

export const TestsChart = ({ data }: TestsChartProps) => {
  // If no data, show message
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Test Execution Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          <p>No execution data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <CardTitle>Test Execution Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value}`, '']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="passed"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 0 }}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 0 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 0 }}
              />
              <Line
                type="monotone"
                dataKey="blocked"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-8 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
            <span className="text-sm text-muted-foreground">Passed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
            <span className="text-sm text-muted-foreground">Failed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-muted-foreground mr-2"></div>
            <span className="text-sm text-muted-foreground">Blocked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
