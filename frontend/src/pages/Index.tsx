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
      <Seo title="Home" description="Get to know the Department of Computer Applications at MSU-IIT. Explore undergraduate and graduate programs, meet our faculty, and find news and visiting information." />
      <section className="home-intro" aria-labelledby="home-title">
        <div className="container home-content home-opening">
          <div className="home-welcome">
            <p className="home-eyebrow">{departmentIdentity.college} · MSU-IIT</p>
            <h1 id="home-title"><span className="home-title-prefix">Department of </span>Computer Applications</h1>
            <p className="home-lead">{departmentIntroduction.lead}</p>
            <div className="home-intro-actions">
              <Link className="action-link" to="/programs">Explore programs <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="outline-link" to="/about/contact">Contact us</Link>
            </div>
          </div>
          <figure className="home-photo">
            <div className="home-photo-placeholder" aria-hidden="true" />
            <figcaption>Department photograph to be added</figcaption>
          </figure>
        </div>
      </section>

      <section className="container home-content home-section home-study" aria-labelledby="home-study-title">
        <div className="home-section-heading">
          <h2 id="home-study-title">Study with us</h2>
          <Link className="text-link" to="/admissions">How to apply</Link>
        </div>
        <p className="home-section-description">Choose a degree to find program information and academic requirements.</p>
        <ul className="home-degree-grid">
          {programs.map(program => (
            <li key={program.code}>
              <Link className="home-degree-link" to={program.route}>
                <p className="home-degree-level">{program.level} · {program.code}</p>
                <h3>{program.title}</h3>
                <span className="home-degree-action">View program <ArrowRight size={18} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-about" aria-labelledby="home-about-title">
        <div className="container home-content home-section home-about-layout">
          <div>
            <h2 id="home-about-title">Get to know the department</h2>
            <p className="home-overview">{departmentProfileText(data?.overview) || departmentIntroduction.overview}</p>
            <p className="home-overview">{departmentIntroduction.explanation}</p>
            <div className="home-about-links">
              <Link className="text-link" to="/about">About the department</Link>
              <Link className="text-link" to="/about#purpose">Our college’s vision and mission</Link>
            </div>
          </div>
          <nav aria-label="People and work">
            <ul className="home-discovery-links">
              <li><Link to="/faculty"><span>Meet our faculty and staff</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
              <li><Link to="/research"><span>Research information</span><ArrowRight size={20} aria-hidden="true" /></Link></li>
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
            <Link className="text-link" to="/about/location">Location and directions</Link>
            <Link className="text-link" to="/about/location#access">Directions and access assistance</Link>
            <Link className="text-link" to="/accessibility">Help using this website</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
