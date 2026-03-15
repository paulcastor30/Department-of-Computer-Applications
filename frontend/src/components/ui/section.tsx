import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "primary";
  id?: string;
}

export function Section({ children, className, variant = "default", id }: SectionProps) {
  const variantClasses = {
    default: "bg-background",
    muted: "bg-muted/30",
    primary: "bg-primary text-primary-foreground",
  };

  return (
    <section id={id} className={cn("section-padding", variantClasses[variant], className)}>
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, align = "center", className, children }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", align === "center" && "text-center max-w-3xl mx-auto", className)}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
