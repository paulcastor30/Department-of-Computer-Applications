import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import { isSOJTContent, type SOJTResponse } from "@/content/sojtProcess";

export function useSOJTGuide() {
  return useQuery<SOJTResponse>({
    queryKey: ["academics", "sojt-guide", "bsca"],
    queryFn: async () => {
      const response = await fetchJSON<SOJTResponse>("/api/academics/sojt-guide/bsca/");
      if (!response?.reviewed_on || !isSOJTContent(response.content)) throw new Error("Approved SOJT guidance is unavailable.");
      return response;
    },
    retry: false,
  });
}
