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
import { WhatIsComputerApplications, WhatStudentsBuild, ChoosingComputerApplications } from "@/components/HomeOrientation";
import { RealDepartmentWork } from "@/components/RealDepartmentWork";
import departmentBanner from "@/assets/department-home-web.png";

export default function Index() {
  const { data } = useDepartmentProfile();
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
            <p className="home-eyebrow">{departmentIdentity.college} · MSU-IIT</p>
            <h1 id="home-title"><span className="home-title-prefix">Department of </span>Computer Applications</h1>
            <p className="home-lead">{departmentIntroduction.lead}</p>
            <p className="mt-3 max-w-prose leading-7 text-muted-foreground">Think of software reading a sensor, controlling a device or connecting equipment to a network.</p>
            <p className="mt-3 max-w-prose leading-7">Study with us: <strong>BSCA</strong> (bachelor’s degree) and <strong>MSCA</strong> (master’s degree).</p>
            <div className="home-intro-actions">
              <Link className="action-link" to="/programs">Explore programs <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="outline-link" to="/about/contact">Contact us</Link>
            </div>
          </div>
          <div className="home-visual">
            <img src={departmentBanner} alt="" width="1600" height="603" decoding="async" />
          </div>
        </div>
      </section>

      <section className="container home-content py-6" aria-labelledby="quick-tasks-title">
        <h2 id="quick-tasks-title">What would you like to do?</h2>
        <nav aria-label="Quick tasks" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link className="outline-link justify-start" to="/resources#student-forms">Fill or download thesis forms</Link>
          <Link className="outline-link justify-start" to="/resources#registrar-forms">Find registrar services</Link>
          <Link className="outline-link justify-start" to="/admissions">Apply, shift or transfer</Link>
          <Link className="outline-link justify-start" to="/accessibility">Get help using this website</Link>
        </nav>
      </section>

      <WhatIsComputerApplications />

      <section className="container home-content home-section home-study" aria-labelledby="home-study-title">
        <div className="home-section-heading">
          <h2 id="home-study-title">Study with us</h2>
          <Link className="text-link" to="/admissions">How to apply</Link>
        </div>
        <p className="home-section-description">Choose undergraduate foundations or advanced graduate study. Each program page provides subjects, the prospectus and official admission guidance.</p>
        <ul className="home-degree-grid">
          {programs.map(program => (
            <li key={program.code}>
              <Link className="home-degree-link" to={program.route}>
                <p className="home-degree-level">{program.level} · {program.code}</p>
                <h3>{program.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{program.degreeLevelCode === "UNDERGRAD" ? "Learn programming and how software, firmware and hardware work together in embedded and connected devices." : "Advanced study and research in Computer Applications, including embedded and connected systems. Check the official graduate admission requirements."}</p>
                <span className="home-degree-action">View program <ArrowRight size={18} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WhatStudentsBuild />
      <RealDepartmentWork />
      <ChoosingComputerApplications />

      <section className="home-about" aria-labelledby="home-about-title">
        <div className="container home-content home-section home-about-layout">
          <div>
            <h2 id="home-about-title">Get to know the department</h2>
            <p className="home-overview">{departmentProfileText(data?.overview) || departmentIntroduction.overview}</p>
            <div className="home-about-links">
              <Link className="text-link" to="/about">About the department</Link>
              <Link className="text-link" to="/about#purpose">Our college’s vision and mission</Link>
              <Link className="text-link" to="/facilities">Facilities</Link>
              <Link className="text-link" to="/accreditation">Accreditation &amp; Quality Assurance</Link>
            </div>
          </div>
          <nav aria-label="People and work">
            <ul className="home-discovery-links">
              <li><Link to="/faculty"><span>Meet our faculty and staff</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
              <li><Link to="/research"><span>Research information</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
              <li><Link to="/resources"><span>Student &amp; faculty resources</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
              <li><Link to="/extension"><span>Community work</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="container home-content home-section" aria-labelledby="home-news-title">
        <div className="home-section-heading">
          <h2 id="home-news-title">News and announcements</h2>
          <Link className="text-link" to="/news">All news and events</Link>
        </div>
        <NewsList limit={3} />
      </section>

      <section className="home-visit" aria-labelledby="home-help-title">
        <div className="container home-content home-section home-support">
          <div>
            <h2 id="home-help-title">Visit or get in touch</h2>
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
            <Link className="text-link" to="/about/location#access">Directions and access assistance</Link>
            <Link className="text-link" to="/accessibility">Help using this website</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
