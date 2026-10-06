import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { visitGuidance } from "@/content/visitGuidance";

const floors = [
  { floor: "Second floor", rooms: [
    { name: "Internet of Things (IoT) laboratory", use: "IoT laboratory" },
  ] },
  { floor: "Third floor", rooms: [
    { name: "ICT3C and ICT3D", use: "Lecture sessions" },
    { name: "Embedded laboratory", use: "Embedded systems laboratory" },
  ] },
  { floor: "Fourth floor", rooms: [
    { name: "ICT4A and ICT4B", use: "Laboratory classes" },
  ] },
];

export default function Facilities() {
  return (
    <>
      <Seo title="Facilities" description="Find lecture rooms and laboratories used by Computer Applications on the second, third and fourth floors of the CCS building." />
      <PageHero title="Facilities" subtitle="Lecture rooms and laboratories in the College of Computer Studies building." />
      <div className="container max-w-4xl space-y-10 py-12">
        <p className="leading-8">Computer Applications uses the following rooms in the College of Computer Studies (CCS) building at MSU-IIT. Find your room by floor below.</p>
        {floors.map(({ floor, rooms }) => (
          <section key={floor} aria-labelledby={floor.replace(/ /g, "-")}>
            <h2 id={floor.replace(/ /g, "-")} className="section-title">{floor}</h2>
            <dl className="mt-4 divide-y divide-border rounded-lg border border-border bg-card px-5">
              {rooms.map(({ name, use }) => (
                <div key={name} className="py-5">
                  <dt className="text-lg font-semibold">{name}</dt>
                  <dd className="mt-2 leading-7 text-muted-foreground">{use}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <section aria-labelledby="building-access">
          <h2 id="building-access" className="section-title">Getting to your floor</h2>
          <p className="mt-4 leading-8">{visitGuidance.betweenFloors}</p>
          <Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/about/location#access">Directions and building access</Link>
        </section>
        <section aria-labelledby="room-enquiries">
          <h2 id="room-enquiries" className="section-title">Before using a room</h2>
          <p className="mt-4 leading-8">For room availability, opening hours, equipment or access assistance, contact the department before your visit.</p>
          <Link className="outline-link mt-5" to="/about/contact">Contact the department</Link>
        </section>
        <nav aria-label="Related information">
          <h2 className="section-title">You may also need</h2>
          <Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/programs">Academic programs</Link>
        </nav>
      </div>
    </>
  );
}
