import { useCallback, useMemo, useState, type ReactNode } from "react";
import { commonDetailKeys, FormVisitContext, type FormCollection, type CommonDetails, type VisitState } from "./formVisitContext";

export function FormVisitProvider({ children }: { children: ReactNode }) {
  const [program, chooseProgram] = useState<"BSCA" | "MSCA" | "">("");
  const [collections, setCollections] = useState<Partial<Record<FormCollection, VisitState>>>({});
  const remember = useCallback((collection: FormCollection, values: CommonDetails, enabled?: boolean) => {
    setCollections(current => {
      const active = enabled ?? current[collection]?.enabled ?? false;
      return { ...current, [collection]: { enabled: active, values: active ? Object.fromEntries(Object.entries({ ...current[collection]?.values, ...values }).filter(([key]) => commonDetailKeys.has(key))) : {} } };
    });
  }, []);
  const value = useMemo(() => ({ program, chooseProgram, collections, remember }), [program, collections, remember]);
  return <FormVisitContext.Provider value={value}>{children}</FormVisitContext.Provider>;
}
