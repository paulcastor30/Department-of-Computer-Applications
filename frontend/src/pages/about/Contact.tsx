import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with the Department of Computer Applications."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Send Us a Message" align="left" />
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="form-label">Full Name *</label>
                  <Input placeholder="Enter your full name" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <Input type="email" placeholder="Enter your email" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Subject *</label>
                <Input placeholder="What is your inquiry about?" className="form-input" />
              </div>
              <div>
                <label className="form-label">Message *</label>
                <Textarea placeholder="Type your message here..." className="form-input min-h-[150px]" />
              </div>
              <Button type="submit" className="btn-cta-primary">Send Message</Button>
            </form>
          </div>

          <div>
            <SectionHeader title="Contact Information" align="left" />
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:dca@university.edu.ph" className="text-primary hover:underline">dca@university.edu.ph</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+63-2-1234-5678" className="text-primary hover:underline">+63 (2) 1234-5678</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm">
                    College of Science Building, Room 301<br />
                    University Campus<br />
                    Metro Manila, Philippines 1234
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
