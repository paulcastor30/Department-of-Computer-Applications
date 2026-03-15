import { FileText, Download, File, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadItem {
  title: string;
  description?: string;
  fileType?: "pdf" | "doc" | "xls" | "other";
  fileSize?: string;
  href: string;
}

interface DownloadBlockProps {
  item: DownloadItem;
  className?: string;
}

const fileIcons = {
  pdf: FileText,
  doc: FileText,
  xls: FileSpreadsheet,
  other: File,
};

export function DownloadBlock({ item, className }: DownloadBlockProps) {
  const Icon = fileIcons[item.fileType || "other"];

  return (
    <a
      href={item.href}
      download
      className={cn("download-block group", className)}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {item.title}
        </div>
        {(item.description || item.fileSize) && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {item.description && <span>{item.description}</span>}
            {item.fileSize && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.fileSize}</span>
            )}
          </div>
        )}
      </div>
      <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </a>
  );
}

interface DownloadListProps {
  items: DownloadItem[];
  className?: string;
}

export function DownloadList({ items, className }: DownloadListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <DownloadBlock key={index} item={item} />
      ))}
    </div>
  );
}
