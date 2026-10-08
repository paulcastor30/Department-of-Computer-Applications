import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { homeOrientation } from "@/content/homeOrientation";

export function WhatIsComputerApplications() {
  return <section id="computer-applications" className="container home-content home-section" aria-labelledby="home-meaning-title">
    <h2 id="home-meaning-title">What is Computer Applications?</h2>
    <p className="home-section-description">{homeOrientation.meaning}</p>
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-primary">How computing connects to the physical world</h3>
      <p className="mt-2 max-w-prose leading-7">Follow a sensor reading from a device to useful information. This is one possible system, rather than a required design for every project.</p>
      <ol className="home-computing-flow mt-5" aria-label="Example: from sensing to useful information">
        {homeOrientation.flow.map((step, index) => <li key={step.term}>
          <span className="home-flow-number" aria-hidden="true">{index + 1}</span>
          <div><h4 className="font-semibold text-primary">{step.title}</h4><p className="font-medium text-secondary">{step.term}</p><p className="mt-1 leading-7">{step.text}</p></div>
          {index < homeOrientation.flow.length - 1 && <ArrowDown className="home-flow-arrow" aria-hidden="true" size={20} />}
        </li>)}
      </ol>
      <p className="mt-4 max-w-prose leading-7 text-muted-foreground">Software can also send commands back to a device. Not every system needs a network, cloud service or artificial intelligence.</p>
    </div>
    <AcademicSpecializations />
    <DisciplineComparison />
  </section>;
}

export function WhatStudentsBuild() {
  return <section className="home-about" aria-labelledby="home-build-title">
    <div className="container home-content home-section">
      <h2 id="home-build-title">What will you learn to build?</h2>
      <p className="home-section-description">Study programming, electronics and how they work together, then apply them in projects and research.</p>
      <ul className="home-example-grid mt-5">{homeOrientation.builds.map(item => <li key={item.title} className="rounded-md border border-border bg-background p-5"><h3 className="text-lg font-semibold text-primary">{item.title}</h3><p className="mt-2 leading-7">{item.text}</p></li>)}</ul>
      <details className="home-disclosure mt-5"><summary>Understand embedded systems, edge computing and AIoT</summary>
        <dl className="home-term-list">
          <div><dt>Embedded systems</dt><dd>Computers built into devices to perform specific tasks, rather than general-purpose desktop computing.</dd></div>
          <div><dt>Edge computing</dt><dd>Processing data on or near a device, rather than sending everything to a remote service.</dd></div>
          <div><dt>Artificial Intelligence of Things (AIoT)</dt><dd>Connected devices combined with artificial intelligence to interpret data and support intelligent responses.</dd></div>
        </dl>
      </details>
      <Link className="text-link inline-flex min-h-11 items-center mt-3" to="/programs/bsca#study">Explore BSCA subjects and learning areas</Link>
    </div>
  </section>;
}

export function ChoosingComputerApplications() {
  return <section className="container home-content home-section" aria-labelledby="home-fit-title">
    <h2 id="home-fit-title">Is BSCA for me?</h2>
    <p className="home-section-description">BSCA may be a good fit if you enjoy:</p>
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{homeOrientation.interests.map(item => <li key={item}>{item}</li>)}</ul>
    <p className="mt-4 max-w-prose leading-7">The prospectus moves from programming, mathematics and digital systems to integrated systems, projects and thesis work. Read the study plan and official admission guidance to decide whether the program fits your interests.</p>
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link className="text-link inline-flex min-h-11 items-center" to="/programs/bsca#before-applying">BSCA prospectus and admission information</Link><Link className="text-link inline-flex min-h-11 items-center" to="/admissions">How to apply</Link></div>
    <details className="home-disclosure mt-5"><summary>How does BSCA differ from related computing programs?</summary>
      <p className="mt-3 leading-7">These fields overlap. The differences are in academic emphasis and curriculum, rather than absolute boundaries. Programming and work with devices are not exclusive to BSCA.</p>
      <dl className="home-term-list">{homeOrientation.comparisons.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
      <p className="mt-4 leading-7">Compare the actual study plans when choosing a degree. These brief descriptions are orientation, not complete program definitions.</p>
      <p className="mt-3 leading-7">Official descriptions: <a className="text-link" href="https://www.msuiit.edu.ph/academics/colleges/ccs/">MSU-IIT computing programs</a> and <a className="text-link" href="https://msuiit.edu.ph/academics/colleges/coe/programs/">MSU-IIT engineering programs</a>.</p>
    </details>
    <details className="home-disclosure mt-3"><summary>Possible career directions</summary>
      <p className="mt-3 leading-7">The program’s learning areas can support directions such as:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{homeOrientation.directions.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="mt-3 leading-7">Work involving edge computing or AIoT combines these areas with data processing and intelligent systems. These are possible directions, not guaranteed jobs; preparation and opportunities vary.</p>
      <Link className="text-link inline-flex min-h-11 items-center mt-3" to="/programs/bsca">Read the BSCA program information</Link>
    </details>
  </section>;
}

/** Educational orientation, not a list of approved research groups or faculty expertise. */
export function AcademicSpecializations() {
  return <div className="mt-6">
    <h3 className="text-xl font-semibold text-primary">Four areas of specialization</h3>
    <dl className="home-specializations mt-4">{homeOrientation.specializations.map(area => <div key={area.title} className="rounded-md border border-border bg-background p-5"><dt className="font-semibold text-primary">{area.title}</dt><dd className="mt-2 leading-7">{area.text}</dd></div>)}</dl>
  </div>;
}

export function DisciplineComparison() {
  return <details className="home-disclosure mt-5"><summary>How does Computer Applications compare with related disciplines?</summary>
    <p className="mt-3 leading-7">These fields overlap. Differences reflect academic emphasis and curriculum, rather than absolute boundaries. Compare the actual study plans when choosing a degree.</p>
    <dl className="home-term-list">{homeOrientation.comparisons.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
  </details>;
}
