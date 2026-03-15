import { ReactNode } from "react";
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
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <HeroSection title={title} subtitle={subtitle} size="sm">
      {children}
    </HeroSection>
  );
}
