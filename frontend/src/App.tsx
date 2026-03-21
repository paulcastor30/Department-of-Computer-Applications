import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// About Pages
import About from "./pages/about/About";
import VMGO from "./pages/about/VMGO";
import History from "./pages/about/History";
import ChairMessage from "./pages/about/ChairMessage";
import Organization from "./pages/about/Organization";
import FacultyStaff from "./pages/about/FacultyStaff";
import Contact from "./pages/about/Contact";
import Location from "./pages/about/Location";

// Programs Pages
import Programs from "./pages/programs/Programs";
import BSCA from "./pages/programs/BSCA";
import MSCA from "./pages/programs/MSCA";

// Research Pages
import Research from "./pages/research/Research";
import ResearchFocusAreas from "./pages/research/FocusAreas";
import ResearchFacultyProfiles from "./pages/research/FacultyProfiles";
import ResearchProjects from "./pages/research/Projects";
import Publications from "./pages/research/Publications";
import Labs from "./pages/research/Labs";
import StudentResearch from "./pages/research/StudentResearch";
import Collaborations from "./pages/research/Collaborations";
import ResearchMetrics from "./pages/research/Metrics";

// Extension Pages
import Extension from "./pages/extension/Extension";
import ExtensionPrograms from "./pages/extension/Programs";
import Partnerships from "./pages/extension/Partnerships";
import TechTransfer from "./pages/extension/TechTransfer";
import ServiceProjects from "./pages/extension/ServiceProjects";
import Impact from "./pages/extension/Impact";

// Faculty Pages
import Faculty from "./pages/faculty/Faculty";
import FacultyProfile from "./pages/faculty/FacultyProfile";
import Qualifications from "./pages/faculty/Qualifications";
import Achievements from "./pages/faculty/Achievements";
import Development from "./pages/faculty/Development";

// Students Pages
import CurrentStudents from "./pages/students/CurrentStudents";
import ProspectiveStudents from "./pages/students/ProspectiveStudents";
import Organizations from "./pages/students/Organizations";

// Other Pages
import Admissions from "./pages/Admissions";
import Alumni from "./pages/Alumni";
import News from "./pages/News";
import Accreditation from "./pages/Accreditation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
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
            <Route path="/research" element={<Research />} />
            <Route path="/research/focus-areas" element={<ResearchFocusAreas />} />
            <Route path="/research/faculty-profiles" element={<ResearchFacultyProfiles />} />
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
            <Route path="/faculty/:id" element={<FacultyProfile />} />
            <Route path="/faculty/qualifications" element={<Qualifications />} />
            <Route path="/faculty/achievements" element={<Achievements />} />
            <Route path="/faculty/development" element={<Development />} />
            
            {/* Students Routes */}
            <Route path="/students/current" element={<CurrentStudents />} />
            <Route path="/students/prospective" element={<ProspectiveStudents />} />
            <Route path="/students/organizations" element={<Organizations />} />
            
            {/* Other Routes */}
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/admissions/apply" element={<Admissions />} />
            <Route path="/admissions/request-info" element={<Admissions />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/events" element={<News />} />
            <Route path="/accreditation" element={<Accreditation />} />
            <Route path="/accreditation/aaccup" element={<Accreditation />} />
            <Route path="/accreditation/ched" element={<Accreditation />} />
            <Route path="/accreditation/aun-qa" element={<Accreditation />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
