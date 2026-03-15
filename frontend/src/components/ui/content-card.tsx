import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  external?: boolean;
  badge?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  featured?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ContentCard({
  title,
  description,
  image,
  href,
  external,
  badge,
  icon,
  footer,
  featured,
  className,
  children,
}: ContentCardProps) {
  const Wrapper = href ? (external ? "a" : Link) : "div";
  const wrapperProps = href
    ? external
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : { to: href }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        featured ? "card-featured" : "card-elevated",
        href && "cursor-pointer group",
        "overflow-hidden flex flex-col",
        className
      )}
    >
      {image && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          {icon && <div className="text-secondary shrink-0">{icon}</div>}
          {badge && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm mb-4 flex-1">{description}</p>
        )}
        {children}
        {footer && <div className="mt-auto pt-4 border-t border-border">{footer}</div>}
        {href && (
          <div className="flex items-center gap-1 text-sm font-medium text-primary mt-auto pt-3">
            Learn More
            {external ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

interface CardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  const colClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", colClasses[columns], className)}>
      {children}
    </div>
  );
}
