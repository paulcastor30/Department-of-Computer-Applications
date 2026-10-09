import { ReactNode } from "react";
import { departmentIdentity } from "@/content/siteContent";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  backgroundImage?: string;
}

export function HeroSection({
  title,
  subtitle,
  children,
  className,
  size = "md",
  align = "center",
  backgroundImage,
}: HeroSectionProps) {
  const sizeClasses = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-24 md:py-32",
  };

  return (
    <section
      className={cn("hero-primary", sizeClasses[size], className)}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {backgroundImage && <div className="absolute inset-0 bg-primary/85" />}
      <div className={cn("container relative z-10", align === "center" && "text-center")}>
        <div className={cn("max-w-4xl", align === "center" && "mx-auto")}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance animate-fade-in">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {subtitle}
            </p>
          )}
          {children && (
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface PageHeroProps {
  className?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, children, className }: PageHeroProps) {
  return (
    <section className={cn("page-header-formal brand-network-subtle", className)}>
      <div className="container relative z-10">
        <div className="max-w-4xl">
          <div className="page-header-accent" />
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{departmentIdentity.name}</p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-primary md:text-4xl">{title}</h1>
          {subtitle && <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{subtitle}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
