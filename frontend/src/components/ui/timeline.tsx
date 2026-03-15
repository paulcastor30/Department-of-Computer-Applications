import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="text-secondary font-bold text-lg mb-1">{item.year}</div>
          <div className="font-semibold text-foreground mb-2">{item.title}</div>
          <p className="text-muted-foreground text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
}

export function ProcessSteps({ steps, className }: ProcessStepsProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
              {step.step}
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-6 left-16 w-[calc(100%-4rem)] h-0.5 bg-border" />
            )}
          </div>
          {step.icon && <div className="text-primary mb-2">{step.icon}</div>}
          <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
          <p className="text-muted-foreground text-sm">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
