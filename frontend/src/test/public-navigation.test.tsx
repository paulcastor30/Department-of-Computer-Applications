import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('@/lib/api', () => ({ fetchJSON: vi.fn(async (url: string) => {
  if (url.includes('department-profile')) return { overview: 'Official department overview', mission: 'Official mission' };
  if (url.includes('/news/example/')) return { id: 1, slug: 'example', title: 'Department open day', summary: 'Meet the department', body: 'Visit details from the official announcement.', published_at: '2026-10-05T01:00:00Z' };
  if (url.includes('site-settings')) return { primary_email: 'department@example.edu' };
  return [];
}) }));
beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

it('shows the department and degree routes without waiting for news', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'Department of Computer Applications' })).toBeInTheDocument();
  const main = within(screen.getByRole('main'));
  expect(main.getByRole('link', { name: 'Explore programs' })).toHaveAttribute('href', '/programs');
  expect(main.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/about/contact');
  expect(main.getByRole('link', { name: /Undergraduate.*BSCA/ })).toHaveAttribute('href', '/programs/bsca');
  expect(main.getByRole('link', { name: /Graduate.*MSCA/ })).toHaveAttribute('href', '/programs/msca');
  expect(await screen.findByText('Official department overview')).toBeInTheDocument();
});
it('searches Home correctly and returns focus when Escape closes search', async () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: 'Search site' });
  fireEvent.click(toggle);
  const input = screen.getByLabelText('Find a page');
  expect(input).toHaveFocus();
  fireEvent.change(input, { target: { value: '  home  ' } });
  expect(screen.getByRole('status')).toHaveTextContent('1 matching page');
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(screen.queryByLabelText('Find a page')).not.toBeInTheDocument();
  expect(toggle).toHaveFocus();
});
it('moves focus to the new heading after a route change', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'About the department' }));
  const heading = await screen.findByRole('heading', { level: 1, name: 'About the department' });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(screen.getByRole('link', { name: 'About', current: 'page' })).toBeInTheDocument();
});
it('shows CMS contact information and a practical help route', async () => {
  window.history.replaceState({}, '', '/about/contact');
  render(<App />);
  expect((await screen.findAllByRole('link', { name: 'department@example.edu' }))[0]).toHaveAttribute('href', 'mailto:department@example.edu');
  expect(screen.getByText('Step-free access and assistance')).toBeInTheDocument();
});

it('closes the mobile menu with Escape and restores focus', () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: 'Menu' });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(toggle, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});
it('opens a complete CMS news article with a clearly labelled publication date', async () => {
  window.history.replaceState({}, '', '/news/example');
  render(<App />);
  expect(await screen.findByRole('heading', { level: 1, name: 'Department open day' })).toBeInTheDocument();
  expect(screen.getByText(/Posted.*October.*2026/)).toHaveAttribute('datetime', '2026-10-05T01:00:00Z');
  expect(screen.getByText('Visit details from the official announcement.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to news and events' })).toHaveAttribute('href', '/news');
});

it('takes the college vision link directly to the purpose section', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Our college’s vision and mission' }));
  await screen.findByRole('heading', { name: 'Why we do this work' });
  await waitFor(() => expect(document.getElementById('purpose')).toHaveFocus());
});

it('gives the public a help route as well as an application route on Home', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/about/contact');
  expect(screen.getByRole('link', { name: 'Directions and access assistance' })).toHaveAttribute('href', '/about/location#access');
  expect(within(screen.getByRole('region', { name: 'Study with us' })).getByRole('link', { name: 'How to apply' })).toHaveAttribute('href', '/admissions');
  expect(screen.getByRole('link', { name: 'Help using this website' })).toHaveAttribute('href', '/accessibility');
  const people = screen.getByRole('navigation', { name: 'People and work' });
  const study = screen.getByRole('heading', { name: 'Study with us' });
  expect(study.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it('explains teaching, research, and community work through main navigation', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Our work' }));
  expect(await screen.findByRole('heading', { level: 1, name: 'What we do' })).toBeInTheDocument();
  for (const title of ['Teaching and learning', 'Research', 'Community work']) {
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
  }
  expect(screen.getByText('Thesis requirement: Undergraduate Thesis.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ask about our work' })).toHaveAttribute('href', '/about/contact');
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://msuiit-comapps.vercel.app/our-work');
});
it('offers direct email subjects for study, collaboration, and access questions', async () => {
  window.history.replaceState({}, '', '/about/contact');
  render(<App />);
  const study = await screen.findByRole('link', { name: 'Study or application question' });
  await waitFor(() => expect(study).toHaveAttribute('href', 'mailto:department@example.edu?subject=Study%20or%20application%20enquiry'));
  expect(screen.getByRole('link', { name: 'Research or community enquiry' })).toHaveAttribute('href', 'mailto:department@example.edu?subject=Research%20or%20community%20enquiry');
  expect(screen.getByRole('link', { name: 'Visit or access assistance' })).toHaveAttribute('href', 'mailto:department@example.edu?subject=Visit%20or%20access%20assistance%20enquiry');
});
it('distinguishes publication dates from activity dates and links to visiting help', () => {
  window.history.replaceState({}, '', '/news');
  render(<App />);
  expect(screen.getByText(/Dates marked.*Posted.*show when an announcement was published/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ask about visiting hours' })).toHaveAttribute('href', '/about/contact#visit');
});

it('finds a public question by its full wording in site search', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Search site' }));
  fireEvent.change(screen.getByLabelText('Find a page'), { target: { value: 'What do we do' } });
  expect(within(screen.getByRole('search')).getByRole('link', { name: 'What do we do?' })).toHaveAttribute('href', '/our-work');
});

it('identifies the supplied statements as college content rather than department statements', async () => {
  window.history.replaceState({}, '', '/about/vmgo');
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'College vision and mission' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'CCS vision' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'CCS mission' })).toBeInTheDocument();
  expect(screen.getByText(/Separate university-approved department mission and vision statements are not available/)).toBeInTheDocument();
  expect(screen.getByText('Offer highly specialized and ladderized programs')).toBeInTheDocument();
  expect(screen.queryByText('Official mission')).not.toBeInTheDocument();
});
