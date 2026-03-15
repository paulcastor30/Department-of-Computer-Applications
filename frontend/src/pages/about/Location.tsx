import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { MapPin, Car, Train, Bus } from "lucide-react";

export default function Location() {
  return (
    <>
      <PageHero
        title="Location & Directions"
        subtitle="Find us on campus and learn how to get here."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Campus Location" align="left" />
            <div className="card-elevated p-6 mb-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-secondary shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Department of Computer Applications</h3>
                  <p className="text-muted-foreground">
                    College of Science Building, 3rd Floor, Room 301<br />
                    University Campus<br />
                    Metro Manila, Philippines 1234
                  </p>
                </div>
              </div>
            </div>

            <SectionHeader title="Getting Here" align="left" className="mt-8" />
            <div className="space-y-4">
              <div className="card-elevated p-5">
                <div className="flex items-start gap-4">
                  <Car className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">By Car</h4>
                    <p className="text-sm text-muted-foreground">
                      Parking is available at the Main Parking Area. Enter through Gate 1 and follow signs to the College of Science Building.
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-elevated p-5">
                <div className="flex items-start gap-4">
                  <Train className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">By Train (MRT/LRT)</h4>
                    <p className="text-sm text-muted-foreground">
                      Nearest station: University Station. From the station, take a 10-minute walk or jeepney ride to the main campus.
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-elevated p-5">
                <div className="flex items-start gap-4">
                  <Bus className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">By Bus/Jeepney</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple bus and jeepney routes pass by the university. Alight at the Main Gate and proceed to the College of Science Building.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="aspect-video rounded-xl bg-muted overflow-hidden mb-6">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <p className="text-muted-foreground">[Map Embed Placeholder]</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              [Google Maps or OpenStreetMap embed will be displayed here]
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
