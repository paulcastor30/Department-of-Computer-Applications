import { fetchJSON } from "@/lib/api";
import type { DepartmentProfile } from "@/types/api";

export const getDepartmentInfo = () => fetchJSON<DepartmentProfile>("/api/core/department-profile/");
