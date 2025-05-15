
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "success" | "warning" | "alert";
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "",
    success: "border-l-4 border-farm-success",
    warning: "border-l-4 border-farm-warning",
    alert: "border-l-4 border-farm-alert",
  };

  const trendColor = trend?.positive ? "text-farm-success" : "text-farm-alert";

  return (
    <Card 
      className={cn("card-hover", variantClasses[variant])}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1 text-sm">
          {description && <p className="text-muted-foreground">{description}</p>}
          {trend && (
            <div className={cn("ml-auto flex items-center gap-1", trendColor)}>
              <span>{trend.positive ? "+" : ""}{trend.value}%</span>
              <span>{trend.positive ? "↑" : "↓"}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
