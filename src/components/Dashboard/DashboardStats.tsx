
import { DashboardStat } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  stats: DashboardStat[];
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">{stat.label.includes('Time') ? `${stat.value}m` : stat.value}{stat.label.includes('Coverage') && '%'}</span>
                <div 
                  className={cn(
                    "ml-2 flex items-center text-xs",
                    stat.status === 'positive' ? "text-success" : 
                    stat.status === 'negative' ? "text-destructive" : 
                    "text-muted-foreground"
                  )}
                >
                  {stat.status === 'positive' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : stat.status === 'negative' ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <Minus className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
