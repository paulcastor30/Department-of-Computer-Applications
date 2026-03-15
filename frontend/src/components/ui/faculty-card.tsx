import { Link } from "react-router-dom";
import { Mail, Phone, Award, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FacultyMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  email?: string;
  phone?: string;
  specializations?: string[];
  education?: string;
  researchInterests?: string[];
  publications?: number;
  href?: string;
}

interface FacultyCardProps {
  faculty: FacultyMember;
  variant?: "compact" | "detailed";
  className?: string;
}

export function FacultyCard({ faculty, variant = "compact", className }: FacultyCardProps) {
  const content = (
    <div className={cn("card-elevated p-5 group", className)}>
      <div className="flex gap-4">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted overflow-hidden shrink-0">
          {faculty.image ? (
            <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {faculty.name.split(" ").map(n => n[0]).join("")}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {faculty.name}
          </h3>
          <p className="text-sm text-secondary font-medium">{faculty.position}</p>
          {faculty.education && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{faculty.education}</p>
          )}
          {faculty.specializations && faculty.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {faculty.specializations.slice(0, 3).map((spec, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {variant === "detailed" && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-3 text-sm">
            {faculty.email && (
              <a href={`mailto:${faculty.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />
                {faculty.email}
              </a>
            )}
            {faculty.publications && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {faculty.publications} publications
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (faculty.href) {
    return <Link to={faculty.href}>{content}</Link>;
  }

  return content;
}

interface FacultyGridProps {
  faculty: FacultyMember[];
  variant?: "compact" | "detailed";
  className?: string;
}

export function FacultyGrid({ faculty, variant = "compact", className }: FacultyGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {faculty.map((member) => (
        <FacultyCard key={member.id} faculty={member} variant={variant} />
      ))}
    </div>
  );
}
