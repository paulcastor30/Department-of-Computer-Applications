import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface StatTileProps {
  value: string;
  label: string;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function StatTile({ value, label, icon, trend, className }: StatTileProps) {
  return (
    <div className={cn("stat-tile", className)}>
      {icon && <div className="text-accent mb-3">{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="text-muted-foreground mt-2 font-medium">{label}</div>
      {trend && (
        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-success">
          <TrendingUp className="h-3.5 w-3.5" />
          {trend}
        </div>
      )}
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, columns = 4, className }: StatGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 md:gap-6", colClasses[columns], className)}>
      {children}
    </div>
  );
}