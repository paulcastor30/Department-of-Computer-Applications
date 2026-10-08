import { departmentProfileText } from "@/lib/departmentProfileText";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useDepartmentProfile, useSiteSettings } from "@/hooks/useCore";
import { usePrograms } from "@/hooks/useAcademics";
import { visitGuidance } from "@/content/visitGuidance";
import { departmentIntroduction } from "@/content/departmentIntroduction";
import { departmentIdentity } from "@/content/siteContent";
import { normalizePrograms } from "./programs/programData";
import { NewsList } from "./News";
import { homeOrientation } from "@/content/homeOrientation";
import { WhatIsComputerApplications } from "@/components/HomeOrientation";
import { RealDepartmentWork } from "@/components/RealDepartmentWork";
import departmentBanner from "@/assets/department-home-web.png";

export default function Index() {
  const { data: profile } = useDepartmentProfile();
  const { data: settings } = useSiteSettings();
  const email = settings?.primary_email || departmentIdentity.email;
  const address = settings?.address || departmentIdentity.address;
  const phone = settings?.primary_phone || `${departmentIdentity.phone}, local ${departmentIdentity.phoneExtension}`;
  const { data: programData } = usePrograms();
  const programs = normalizePrograms(programData);

  return (
    <div className="home-page">
      <Seo title="Home" description={homeOrientation.description} />
      <section className="home-intro" aria-labelledby="home-title">
        <div className="container home-content home-opening">
          <div className="home-welcome">
            <p className="home-eyebrow">MSU-Iligan Institute of Technology · Philippines<br />{departmentIdentity.college}</p>
            <h1 id="home-title"><span className="home-title-prefix">Department of </span>Computer Applications</h1>
            <p className="home-tagline">{homeOrientation.tagline}</p>
            <p className="text-sm text-muted-foreground mt-2">{homeOrientation.positioningNote}</p>
            <p className="home-lead">{departmentProfileText(profile?.overview) || departmentIntroduction.lead}</p>
            <p className="mt-3 max-w-prose leading-7 text-muted-foreground">Think of software reading a sensor, controlling a device or connecting equipment to a network.</p>
            <p className="mt-3 max-w-prose leading-7"><Link className="text-link" to="/programs/bsca">Bachelor of Science in Computer Applications (BSCA)</Link><br /><Link className="text-link" to="/programs/msca">Master of Science in Computer Applications (MSCA)</Link></p>
            <div className="home-intro-actions">
              <Link className="action-link" to="/programs">Explore Our Programs <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="outline-link" to="/research">Discover Our Research</Link>
            </div>
          </div>
          <div className="home-visual">
            <img src={departmentBanner} alt="" width="1600" height="603" decoding="async" />
          </div>
        </div>
      </section>

      <section className="container home-content home-section home-study" aria-labelledby="home-study-title">
        <div className="home-section-heading">
          <h2 id="home-study-title">Explore Our Academic Programs</h2>
          <Link className="text-link" to="/admissions">How to apply</Link>
        </div>
        <p className="home-section-description">Choose undergraduate foundations or advanced graduate study. Read the program summaries below, then explore the prospectus and official admission guidance. Both degrees include thesis work.</p>
        <ul className="home-degree-grid">
          {programs.map(program => (
            <li key={program.code}>
              <Link className="home-degree-link" to={program.route}>
                <p className="home-degree-level">{program.level} · {program.code}</p>
                <h3>{program.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{program.summary}</p>
                <span className="home-degree-action">Explore {program.code} <ArrowRight size={18} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WhatIsComputerApplications />
      <RealDepartmentWork />

      <section className="home-about" aria-labelledby="home-research-title">
        <div className="container home-content home-section">
          <h2 id="home-research-title">Research and International Collaboration</h2>
          <p className="home-section-description mt-3">Explore published records of applied computing research involving the department, including embedded, connected and intelligent systems. Each record identifies its own focus and contributors.</p>
          <nav aria-label="Research and international engagement" className="home-about-links">
            <Link className="text-link" to="/research/projects">Research projects</Link>
            <Link className="text-link" to="/research/publications">Research publications</Link>
            <Link className="text-link" to="/research/labs">Research groups and laboratories</Link>
            <Link className="text-link" to="/international-linkages">International collaborations</Link>
          </nav>
          <p className="mt-4 max-w-prose leading-7 text-muted-foreground">Formal institutional partnerships, joint research, coauthorship, conference participation and other international engagement are distinct activities. Consult the relevant records or contact the department to confirm a relationship.</p>
          <div className="home-about-links"><Link className="text-link" to="/research/collaborations">Research collaboration enquiries</Link><Link className="text-link" to="/about">About the department</Link><Link className="text-link" to="/about#purpose">Our college’s vision and mission</Link></div>
        </div>
      </section>

      <section className="container home-content home-section" aria-labelledby="home-news-title">
        <div className="home-section-heading">
          <h2 id="home-news-title">Department News</h2>
          <Link className="text-link" to="/news">View All News and Announcements</Link>
        </div>
        <NewsList limit={3} />
      </section>

      <section className="home-visit" aria-labelledby="home-help-title">
        <div className="container home-content home-section home-support">
          <div>
            <h2 id="home-help-title">Connect With Us</h2>
            <p>Prospective students, researchers, industry collaborators, alumni and visitors are welcome to contact the department about their interests.</p>
            <address className="home-visit-address">{address}</address>
            <dl className="home-contact-details">
              <div><dt>Office hours</dt><dd>{departmentIdentity.officeHours}</dd></div>
              <div><dt>Email</dt><dd><a className="text-link" href={`mailto:${email}`}>{email}</a></dd></div>
              <div><dt>Telephone</dt><dd>{phone}</dd></div>
            </dl>
            <p>{visitGuidance.summary}</p>
          </div>
          <nav className="home-support-actions" aria-label="Visiting and assistance">
            <Link className="action-link" to="/about/contact">Contact the department</Link>
            <Link className="text-link" to="/admissions">Admissions Information</Link>
            <Link className="text-link" to="/about/location#access">Location and Directions</Link>
            <Link className="text-link" to="/alumni">Alumni information</Link>
            <Link className="text-link" to="/accessibility">Website Accessibility Assistance</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
