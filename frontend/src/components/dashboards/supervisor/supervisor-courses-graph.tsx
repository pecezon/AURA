import React from "react";
import { type ChartConfig } from "../../ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";

const chartConfig = {
  completed: {
    label: "Completado",
    color: "#4ade80",
  },
  inProgress: {
    label: "En progreso",
    color: "#60a5fa",
  },
  remaining: {
    label: "Pendiente",
    color: "#f87171",
  },
} satisfies ChartConfig;

interface CourseData {
  courseName: string;
  tag: string;
  assignedWorkers: number;
  inProgressWorkers: number;
  completedWorkers: number;
  overdueWorkers: number;
}

export const SupervisorCoursesGraph: React.FC<CourseData> = ({
  courseName,
  tag,
  inProgressWorkers,
  completedWorkers,
  overdueWorkers,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{courseName}</CardTitle>
        <CardDescription>
          <Badge variant={tag === "Seguridad" ? "outline" : "default"}>
            {tag}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={[
              {
                name: courseName,
                completed: completedWorkers,
                inProgress: inProgressWorkers,
                remaining: overdueWorkers,
              },
            ]}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar
              dataKey="completed"
              fill={chartConfig.completed.color}
              strokeWidth={2}
              radius={8}
              name={chartConfig.completed.label}
            />
            <Bar
              dataKey="inProgress"
              fill={chartConfig.inProgress.color}
              strokeWidth={2}
              radius={8}
              name={chartConfig.inProgress.label}
            />
            <Bar
              dataKey="remaining"
              fill={chartConfig.remaining.color}
              strokeWidth={2}
              radius={8}
              name={chartConfig.remaining.label}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
