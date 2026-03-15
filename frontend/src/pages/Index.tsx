import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Globe, 
  FlaskConical,
  Building,
  Calendar,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import heroCampus from "@/assets/hero-campus.jpg";
import studentsLab from "@/assets/students-lab.jpg";
import researchLab from "@/assets/research-lab.jpg";
import classroomTeaching from "@/assets/classroom-teaching.jpg";

const stats = [
  { value: "95%", label: "Employment Rate", icon: <Briefcase className="h-8 w-8" />, trend: "+3% from last year" },
  { value: "85+", label: "Scopus Publications", icon: <BookOpen className="h-8 w-8" />, trend: "5-year total" },
  { value: "600+", label: "OJT Hours Required", icon: <Building className="h-8 w-8" /> },
  { value: "50+", label: "Industry Partners", icon: <Globe className="h-8 w-8" /> },
];

const featuredPrograms = [
  {
    title: "BS Computer Applications",
    description: "A comprehensive 4-year program designed to produce globally competitive IT professionals with strong foundation in computing, business applications, and industry-ready skills.",
    href: "/programs/bsca",
    badge: "Undergraduate",
    image: studentsLab,
  },
  {
    title: "MS Computer Applications",
    description: "An advanced graduate program (thesis track) that develops research competencies and specialized expertise in emerging computing technologies and methodologies.",
    href: "/programs/msca",
    badge: "Graduate",
    image: researchLab,
  },
];

const featuredResearch = [
  {
    title: "AI-Driven Healthcare Analytics",
    description: "Developing machine learning models for early disease detection and patient outcome prediction using Philippine healthcare datasets.",
    href: "/research/projects/ai-healthcare",
    badge: "Active",
  },
  {
    title: "Smart Agriculture Systems",
    description: "IoT-based precision farming solutions for Filipino farmers, integrating sensor networks with mobile applications.",
    href: "/research/projects/smart-agriculture",
    badge: "Active",
  },
  {
    title: "Cybersecurity Framework for SMEs",
    description: "Developing affordable cybersecurity solutions tailored for small and medium enterprises in the Philippines.",
    href: "/research/projects/cybersecurity",
    badge: "Funded",
  },
];

const newsItems = [
  {
    title: "Department Achieves AACCUP Level III Accreditation",
    description: "The BSCA program has successfully achieved Level III accreditation, recognizing our commitment to quality education.",
    href: "/news/aaccup-accreditation",
    badge: "Announcement",
  },
  {
    title: "Faculty Member Publishes in IEEE Journal",
    description: "Dr. Maria Santos' research on machine learning applications has been published in the IEEE Transactions on Education.",
    href: "/news/ieee-publication",
    badge: "Research",
  },
  {
    title: "Students Win National Hackathon",
    description: "Our BSCA students secured first place in the National ICT Hackathon with their innovative healthcare solution.",
    href: "/news/hackathon-win",
    badge: "Achievement",
  },
];

const upcomingEvents = [
  { title: "Research Colloquium 2025", date: "March 15, 2025", type: "Academic" },
  { title: "Industry Partners Day", date: "March 22, 2025", type: "Industry" },
  { title: "BSCA Orientation", date: "April 5, 2025", type: "Students" },
];

export default function Index() {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="hero-primary py-24 md:py-32 lg:py-40 relative"
        style={{ backgroundImage: `url(${heroCampus})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6 text-sm font-medium">
              <Award className="h-4 w-4" />
              AACCUP Level III Accredited
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Shaping Tomorrow's{" "}
              <span className="text-secondary">Technology Leaders</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              The Department of Computer Applications delivers excellence in computing education, 
              research, and community service. Join a community committed to innovation and global competitiveness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-cta-primary text-base px-8 py-6" asChild>
                <Link to="/admissions/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="btn-cta-secondary text-base px-8 py-6" asChild>
                <Link to="/programs">Explore Programs</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 text-base px-8 py-6" asChild>
                <Link to="/admissions/request-info">Request Information</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <Section className="-mt-16 relative z-20 py-0">
        <StatGrid>
          {stats.map((stat, index) => (
            <StatTile key={index} {...stat} />
          ))}
        </StatGrid>
      </Section>

      {/* Featured Programs */}
      <Section variant="muted">
        <SectionHeader 
          title="Our Programs" 
          subtitle="Industry-aligned curricula designed to prepare students for successful careers in computing and technology."
        />
        <CardGrid columns={2}>
          {featuredPrograms.map((program, index) => (
            <ContentCard key={index} {...program} featured />
          ))}
        </CardGrid>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/programs">View All Programs</Link>
          </Button>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="section-title text-left mb-6">Why Choose the Department of Computer Applications?</h2>
            <p className="text-muted-foreground mb-8">
              We combine rigorous academic standards with practical industry experience to produce 
              graduates who are ready to make an immediate impact in the technology sector.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accredited Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    AACCUP Level III accredited program with ongoing pursuit of CHED Center of Excellence status.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Expert Faculty</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn from experienced professionals with advanced degrees and active research portfolios.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Industry Connections</h3>
                  <p className="text-sm text-muted-foreground">
                    Strong partnerships with leading tech companies for internships, job placement, and curriculum advisory.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <FlaskConical className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Research Culture</h3>
                  <p className="text-sm text-muted-foreground">
                    Active research programs with opportunities for students to participate in funded projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={classroomTeaching} 
              alt="Faculty member teaching students in a modern classroom" 
              className="rounded-xl shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
              <div className="stat-value text-3xl">25+</div>
              <div className="text-muted-foreground text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Research */}
      <Section variant="muted">
        <SectionHeader 
          title="Research & Innovation" 
          subtitle="Advancing knowledge through impactful research that addresses real-world challenges."
        />
        <CardGrid columns={3}>
          {featuredResearch.map((item, index) => (
            <ContentCard key={index} {...item} icon={<FlaskConical className="h-6 w-6" />} />
          ))}
        </CardGrid>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/research">Explore Research</Link>
          </Button>
        </div>
      </Section>

      {/* News & Events Grid */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          {/* News */}
          <div className="lg:col-span-2">
            <SectionHeader title="Latest News" align="left" className="mb-8" />
            <CardGrid columns={2} className="lg:grid-cols-2">
              {newsItems.map((item, index) => (
                <ContentCard key={index} {...item} />
              ))}
            </CardGrid>
            <Button variant="link" className="mt-4 p-0" asChild>
              <Link to="/news">View All News <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Events Sidebar */}
          <div>
            <SectionHeader title="Upcoming Events" align="left" className="mb-8" />
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="card-elevated p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-secondary">{event.type}</span>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0" asChild>
              <Link to="/news/events">View All Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="hero-primary py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards a rewarding career in technology. 
            Our admissions team is ready to help you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="btn-cta-primary text-base px-8 py-6" asChild>
              <Link to="/admissions/apply">Apply Now</Link>
            </Button>
            <Button variant="outline" className="btn-cta-secondary text-base px-8 py-6" asChild>
              <Link to="/admissions/request-info">Request Information</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 text-base px-8 py-6" asChild>
              <Link to="/about/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <Section variant="muted" className="py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admissions" className="download-block group">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <span className="font-medium group-hover:text-primary transition-colors">Admissions</span>
              <p className="text-sm text-muted-foreground">Apply to our programs</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/research" className="download-block group">
            <FlaskConical className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <span className="font-medium group-hover:text-primary transition-colors">Research</span>
              <p className="text-sm text-muted-foreground">Explore our research</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/students/current" className="download-block group">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <span className="font-medium group-hover:text-primary transition-colors">Student Resources</span>
              <p className="text-sm text-muted-foreground">Forms and documents</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/about/contact" className="download-block group">
            <Users className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <span className="font-medium group-hover:text-primary transition-colors">Contact Us</span>
              <p className="text-sm text-muted-foreground">Get in touch</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </Section>
    </>
  );
}
