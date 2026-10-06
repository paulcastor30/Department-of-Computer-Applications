import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

const origin = 'https://msuiit-comapps.vercel.app';
const pages = {
  '/': ['Home', 'Get to know the Department of Computer Applications at MSU-IIT. Explore programs, people, announcements and visiting information.'],
  '/about': ['About the department', 'Meet the Department of Computer Applications, College of Computer Studies, MSU-Iligan Institute of Technology.'],
  '/about/vmgo': ['College vision and mission', 'Read the vision and mission of the College of Computer Studies at MSU-IIT.'],
  '/projects': ['BSCA student projects and prototypes', 'Explore BSCA student outputs: embedded games, sensors, displays and controllers, with reporting years and public Hackster project links.'],
  '/our-work': ['What we do', 'Explore Computer Applications teaching, research information and community enquiries.'],
  '/programs': ['Academic Programs', 'Compare BSCA and MSCA: undergraduate foundations and advanced study and research in Computer Applications.'],
  '/programs/bsca': ['Bachelor of Science in Computer Applications', 'Explore BSCA at MSU-IIT: software, firmware and hardware foundations for embedded, connected and intelligent systems.'],
  '/programs/msca': ['Master of Science in Computer Applications', 'Explore MSCA at MSU-IIT: advanced study and research in Computer Applications, with program information and admissions guidance.'],
  '/faculty': ['Faculty', 'Meet the Computer Applications faculty, explore their expertise and find academic contacts.'],
  '/research/publications': ['Publications', 'Research publications involving DCA faculty and collaborators, with authors, publication dates, journal and conference details, and publisher links.'],
  '/research/conferences': ['Research conferences', 'Conference research involving DCA faculty, students and collaborators: authors, titles, dates, locations and withdrawn entries.'],
  '/research/projects': ['Research projects', 'Browse department research projects by reporting year, with credited leaders, teams and funding categories.'],
  '/research': ['Research', 'Explore department research projects, reporting years, leaders, teams and funding, alongside computing study areas and collaboration enquiries.'],
  '/extension': ['Community work', 'Explore extension programs and community projects involving DCA faculty, their leaders and participants, and collaboration enquiries.'],
  '/news': ['News and events', 'Find published department announcements, activity information and where to ask about dates.'],
  '/thesis-guide': ['Thesis Process Guide', 'Follow BSCA and MSCA thesis steps, find the right forms, prepare requirements and understand proposal, defense and submission deadlines.'],
  '/resources': ['Student & faculty resources', 'Find program documents, thesis checklists, faculty contacts and learning-support enquiries.'],
  '/admissions': ['How to apply', 'Choose BSCA undergraduate or MSCA graduate study and follow official MSU-IIT admission guidance.'],
  '/about/contact': ['Contact & visit', 'Contact the Department of Computer Applications and find office hours, the address and visiting assistance.'],
  '/about/location': ['Location & directions', 'Find the College of Computer Studies at MSU-IIT and plan your visit to the department.'],
  '/accessibility': ['Using this website', 'Get help with keyboard navigation, reading, finding information and asking for assistance.'],
};

// Fetch only public program metadata; CMS wording takes precedence when available.
const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env };
const apiBase = (env.VITE_API_BASE_URL || 'https://department-of-computer-applications-production.up.railway.app').replace(/\/$/, '');
try {
  const response = await fetch(`${apiBase}${apiBase.endsWith('/api') ? '/academics/programs/' : '/api/academics/programs/'}`, { signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  const programs = Array.isArray(payload) ? payload : payload.results || [];
  for (const program of programs) {
    const route = program.code === 'BSCA' ? '/programs/bsca' : program.code === 'MSCA' ? '/programs/msca' : null;
    if (!route) continue;
    const available = value => typeof value === 'string' && value.trim() && !/to be (provided|validated)/i.test(value);
    if (available(program.og_title)) pages[route][0] = program.og_title;
    if (available(program.og_description)) pages[route][1] = program.og_description;
  }
} catch {
  console.warn('Public program metadata was unavailable; approved reference descriptions are used.');
}

const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
for (const [route, [title, description]] of Object.entries(pages)) {
  const fullTitle = title === 'Home' ? 'Department of Computer Applications | MSU-IIT' : `${title} | Computer Applications, MSU-IIT`;
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(fullTitle)}</title>`);
  for (const [attribute, key, value] of [
    ['name', 'description', description], ['property', 'og:title', fullTitle], ['property', 'og:description', description],
    ['name', 'twitter:title', fullTitle], ['name', 'twitter:description', description],
  ]) {
    const pattern = new RegExp(`<meta ${attribute}="${key}"[^>]*>`);
    html = html.replace(pattern, `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  html = html.replace('</head>', `<meta property="og:url" content="${origin}${route}" /><link rel="canonical" href="${origin}${route}" /></head>`);
  const directory = route === '/' ? 'dist' : `dist${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
console.log(`Generated page-specific sharing metadata for ${Object.keys(pages).length} public pages.`);
