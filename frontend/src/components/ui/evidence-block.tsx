import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, Award, Shield } from "lucide-react";

interface EvidenceBadgeProps {
  type: "aaccup" | "ched" | "aun" | "verified" | "pending";
  className?: string;
}

const badgeConfig = {
  aaccup: { label: "AACCUP Evidence", icon: Award, className: "bg-teal-100 text-teal-700 border-teal-200" },
  ched: { label: "CHED Requirement", icon: Shield, className: "bg-blue-100 text-blue-700 border-blue-200" },
  aun: { label: "AUN QA Criteria", icon: CheckCircle2, className: "bg-purple-100 text-purple-700 border-purple-200" },
  verified: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-200" },
  pending: { label: "Pending", icon: AlertCircle, className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export function EvidenceBadge({ type, className }: EvidenceBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border", config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

interface EvidenceBlockProps {
  title: string;
  description?: string;
  accreditation?: ("aaccup" | "ched" | "aun")[];
  children?: ReactNode;
  className?: string;
}

export function EvidenceBlock({ title, description, accreditation, children, className }: EvidenceBlockProps) {
  return (
    <div className={cn("evidence-block", className)}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-semibold text-foreground">{title}</h4>
        {accreditation && accreditation.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {accreditation.map((type) => (
              <EvidenceBadge key={type} type={type} />
            ))}
          </div>
        )}
      </div>
      {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      {children}
    </div>
  );
}

interface MetricPlaceholderProps {
  label: string;
  value?: string;
  target?: string;
  className?: string;
}

export function MetricPlaceholder({ label, value = "—", target, className }: MetricPlaceholderProps) {
  return (
    <div className={cn("flex items-center justify-between p-3 bg-muted rounded-lg", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-semibold text-foreground">{value}</span>
        {target && <span className="text-xs text-muted-foreground ml-1">/ {target}</span>}
      </div>
    </div>
  );
}
