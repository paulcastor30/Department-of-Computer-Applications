import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { Quote } from "lucide-react";

export default function ChairMessage() {
  return (
    <>
      <PageHero
        title="Message from the Chair"
        subtitle="A welcome from the Department Chair on our vision, commitment, and aspirations."
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] rounded-xl bg-muted overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">DR</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Dr. Juan Dela Cruz</h3>
                <p className="text-sm text-secondary font-medium">Department Chair</p>
                <p className="text-sm text-muted-foreground mt-1">Ph.D. Computer Science</p>
                <p className="text-sm text-muted-foreground">University of the Philippines</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <Quote className="h-12 w-12 text-secondary/30 mb-4" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to the Department of Computer Applications! It is my distinct honor to lead 
                  a department that has been at the forefront of computing education for over 25 years.
                </p>
                <p>
                  Our commitment to excellence is reflected in our AACCUP Level III accreditation status, 
                  our research productivity, and most importantly, in the success of our graduates who 
                  continue to make significant contributions in the technology sector both locally and internationally.
                </p>
                <p>
                  We take pride in our outcomes-based curriculum that integrates theoretical foundations 
                  with practical applications, ensuring that our students are not just academically prepared 
                  but are also industry-ready upon graduation. Our partnerships with leading technology 
                  companies provide our students with invaluable internship opportunities and exposure to 
                  real-world challenges.
                </p>
                <p>
                  Our faculty members are not just educators but active researchers contributing to the 
                  advancement of computing knowledge. Their expertise spans artificial intelligence, 
                  data science, cybersecurity, software engineering, and emerging technologies.
                </p>
                <p>
                  As we continue to pursue higher levels of accreditation and recognition, including 
                  CHED Center of Excellence status and AUN-QA certification, we remain focused on our 
                  core mission: to produce globally competitive, ethically grounded, and socially 
                  responsible IT professionals.
                </p>
                <p>
                  I invite you to explore our programs, meet our faculty, and discover why the 
                  Department of Computer Applications is the right choice for your computing education journey.
                </p>
                <p className="font-semibold text-foreground mt-6">
                  Together, let us shape the future of technology.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-semibold">Dr. Juan Dela Cruz</p>
                <p className="text-sm text-muted-foreground">Department Chair, Computer Applications</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
