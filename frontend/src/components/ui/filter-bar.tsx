import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: {
    name: string;
    options: FilterOption[];
  }[];
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  className?: string;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilter,
  className,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === "") {
      delete newFilters[name];
    } else {
      newFilters[name] = value;
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    onSearch?.("");
    onFilter?.({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {Object.keys(activeFilters).length + (searchQuery ? 1 : 0)}
              </span>
            )}
          </Button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="p-4 bg-muted rounded-lg space-y-4 animate-slide-down">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filters.map((filter) => (
              <div key={filter.name}>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {filter.name}
                </label>
                <select
                  value={activeFilters[filter.name] || ""}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
