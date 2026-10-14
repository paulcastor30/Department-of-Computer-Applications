import { lazy, Suspense } from "react";
const Accessibility = lazy(() => import("./pages/Accessibility"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));

// About Pages
const About = lazy(() => import("./pages/about/About"));
const VMGO = lazy(() => import("./pages/about/VMGO"));
const History = lazy(() => import("./pages/about/History"));
const ChairMessage = lazy(() => import("./pages/about/ChairMessage"));
const Organization = lazy(() => import("./pages/about/Organization"));
const FacultyStaff = lazy(() => import("./pages/about/FacultyStaff"));
const Contact = lazy(() => import("./pages/about/Contact"));
const Location = lazy(() => import("./pages/about/Location"));

// Programs Pages
const Programs = lazy(() => import("./pages/programs/Programs"));
const BSCA = lazy(() => import("./pages/programs/BSCA"));
const MSCA = lazy(() => import("./pages/programs/MSCA"));

// Research Pages
const ResearchConferences = lazy(() => import("./pages/research/Conferences"));
const Research = lazy(() => import("./pages/research/Research"));
const ResearchFocusAreas = lazy(() => import("./pages/research/FocusAreas"));
const ResearchFacultyProfiles = lazy(() => import("./pages/research/FacultyProfiles"));
const ResearchProjects = lazy(() => import("./pages/research/Projects"));
const Publications = lazy(() => import("./pages/research/Publications"));
const Labs = lazy(() => import("./pages/research/Labs"));
const StudentResearch = lazy(() => import("./pages/research/StudentResearch"));
const Collaborations = lazy(() => import("./pages/research/Collaborations"));
const ResearchMetrics = lazy(() => import("./pages/research/Metrics"));

// Extension Pages
const Extension = lazy(() => import("./pages/extension/Extension"));
const ExtensionPrograms = lazy(() => import("./pages/extension/Programs"));
const Partnerships = lazy(() => import("./pages/extension/Partnerships"));
const TechTransfer = lazy(() => import("./pages/extension/TechTransfer"));
const ServiceProjects = lazy(() => import("./pages/extension/ServiceProjects"));
const Impact = lazy(() => import("./pages/extension/Impact"));

// Faculty Pages
const Faculty = lazy(() => import("./pages/faculty/Faculty"));
const FacultyProfile = lazy(() => import("./pages/faculty/FacultyProfile"));
const Qualifications = lazy(() => import("./pages/faculty/Qualifications"));
const Achievements = lazy(() => import("./pages/faculty/Achievements"));
const Development = lazy(() => import("./pages/faculty/Development"));

// Students Pages
const Resources = lazy(() => import("./pages/Resources"));
const SOJTGuide = lazy(() => import("./pages/SOJTGuide"));
const TransferEvaluationPortal = lazy(() => import("./pages/TransferEvaluationPortal"));
const ThesisGuide = lazy(() => import("./pages/ThesisGuide"));
const CurrentStudents = lazy(() => import("./pages/students/CurrentStudents"));
const ProspectiveStudents = lazy(() => import("./pages/students/ProspectiveStudents"));
const Organizations = lazy(() => import("./pages/students/Organizations"));

// Other Pages
const Admissions = lazy(() => import("./pages/Admissions"));
const Alumni = lazy(() => import("./pages/Alumni"));
import News from "./pages/News";
const Accreditation = lazy(() => import("./pages/Accreditation"));
const Facilities = lazy(() => import("./pages/Facilities"));
const Projects = lazy(() => import("./pages/Projects"));
const OurWork = lazy(() => import("./pages/OurWork"));
const InternationalLinkages = lazy(() => import("./pages/InternationalLinkages"));

const queryClient = new QueryClient();

function SiteAnalytics() {
  const { pathname } = useLocation();

  return (
    <Analytics
      mode={import.meta.env.PROD ? "production" : "development"}
      route={pathname}
      path={pathname}
    />
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteAnalytics />
        <Layout>
          <Suspense fallback={<p className="container py-12" role="status">Loading page…</p>}>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* About Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/about/vmgo" element={<VMGO />} />
            <Route path="/about/history" element={<History />} />
            <Route path="/about/chair-message" element={<ChairMessage />} />
            <Route path="/about/organization" element={<Organization />} />
            <Route path="/about/faculty-staff" element={<FacultyStaff />} />
            <Route path="/about/contact" element={<Contact />} />
            <Route path="/about/location" element={<Location />} />
            
            {/* Programs Routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/bsca" element={<BSCA />} />
            <Route path="/programs/msca" element={<MSCA />} />
            
            {/* Research Routes */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/focus-areas" element={<ResearchFocusAreas />} />
            <Route path="/research/faculty-profiles" element={<ResearchFacultyProfiles />} />
            <Route path="/research/conferences" element={<ResearchConferences />} />
            <Route path="/research/projects" element={<ResearchProjects />} />
            <Route path="/research/publications" element={<Publications />} />
            <Route path="/research/labs" element={<Labs />} />
            <Route path="/research/student-research" element={<StudentResearch />} />
            <Route path="/research/collaborations" element={<Collaborations />} />
            <Route path="/research/metrics" element={<ResearchMetrics />} />
            
            {/* Extension Routes */}
            <Route path="/extension" element={<Extension />} />
            <Route path="/extension/programs" element={<ExtensionPrograms />} />
            <Route path="/extension/partnerships" element={<Partnerships />} />
            <Route path="/extension/tech-transfer" element={<TechTransfer />} />
            <Route path="/extension/service-projects" element={<ServiceProjects />} />
            <Route path="/extension/impact" element={<Impact />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/faculty/qualifications" element={<Qualifications />} />
            <Route path="/faculty/achievements" element={<Achievements />} />
            <Route path="/faculty/development" element={<Development />} />
            <Route path="/faculty/:slug" element={<FacultyProfile />} />
            
            {/* Students Routes */}
            <Route path="/resources" element={<Resources />} />
            <Route path="/sojt-guide" element={<Suspense fallback={<p className="container py-12" role="status">Loading the SOJT Process Guide…</p>}><SOJTGuide /></Suspense>} />
            <Route path="/thesis-guide" element={<Suspense fallback={<p className="container py-12" role="status">Loading the Thesis Process Guide…</p>}><ThesisGuide /></Suspense>} />
            <Route path="/students/current" element={<CurrentStudents />} />
            <Route path="/students/prospective" element={<ProspectiveStudents />} />
            <Route path="/students/organizations" element={<Organizations />} />
            
            {/* Other Routes */}
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/admissions/transfer-evaluation" element={<Suspense fallback={<p role="status" className="p-8">Loading evaluation portal…</p>}><TransferEvaluationPortal /></Suspense>} />
            <Route path="/admissions/apply" element={<Admissions />} />
            <Route path="/admissions/request-info" element={<Admissions />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/events" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/international-linkages" element={<InternationalLinkages />} />
            <Route path="/accreditation" element={<Accreditation />} />
            <Route path="/accreditation/aaccup" element={<Accreditation />} />
            <Route path="/accreditation/ched" element={<Accreditation />} />
            <Route path="/accreditation/aun-qa" element={<Accreditation />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
