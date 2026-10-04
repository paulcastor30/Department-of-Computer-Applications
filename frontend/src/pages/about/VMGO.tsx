import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Seo } from "@/components/Seo";
import { useDepartmentProfile } from "@/hooks/useCore";
import { placeholder } from "@/content/siteContent";
export default function VMGO() { const { data } = useDepartmentProfile(); return <><Seo title="Mission, vision & goals"/><PageHero title="Mission, vision & goals" subtitle="The department's purpose and direction."/><div className="container max-w-4xl space-y-8 py-12">{[["Mission",data?.mission],["Vision",data?.vision],["Goals",data?.goals]].map(([title,text]) => <section key={title}><h2 className="section-title">{title}</h2><p className="mt-4 whitespace-pre-line leading-8">{text || placeholder}</p></section>)}<Link className="text-link" to="/about">About the department</Link></div></>; }
