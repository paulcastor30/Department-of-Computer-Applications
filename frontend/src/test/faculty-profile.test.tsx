import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FacultyProfile from '../pages/faculty/FacultyProfile';
const shared = vi.hoisted(() => ({ records: [] as import('../types/api').DepartmentContribution[] }));
vi.mock('@/hooks/usePeople', () => ({ useFacultyMember: () => ({ data: {
  department_contributions: shared.records,
  title: 'Example Faculty', position: 'Professor', service_classification: 'retired_dca_faculty', service_classification_display: 'Retired DCA Faculty', faculty_status_display: 'Active', email: 'example@g.msuiit.edu.ph', profile_summary: 'Academic profile.', highest_degree: 'Master’s Degree',
  education_records: [
    { id: 1, degree_name: 'Master of Science', institution: 'University', year_completed: 2020, notes: '' },
    { id: 2, degree_name: 'Doctor of Philosophy', institution: 'University', year_completed: null, notes: 'Ongoing study; degree not yet completed.' },
    { id: 4, degree_level: 'other', degree_name: 'Academic fellowship', institution: 'University', year_completed: 2024, notes: 'Academic fellowship; not a degree.' },
    { id: 5, degree_level: 'doctorate', degree_name: 'Completed doctorate with year unspecified', institution: 'University', year_completed: null, notes: 'Completed qualification; year not supplied by the Department.' },
    { id: 3, degree_name: 'Doctor of Engineering', institution: 'University', year_completed: null, notes: 'Completion status to be validated by the Department.' },
  ], expertise_records: [], supervised_works: [], publications: [], conferences: [], research_projects: [], extension_projects: [], creative_works: [], training_seminars: [], achievements: [],
}, isLoading: false, isError: false }) }));
afterEach(() => { cleanup(); shared.records = []; });
it('distinguishes completed qualifications, ongoing study and unconfirmed records', () => {
  render(<MemoryRouter><FacultyProfile /></MemoryRouter>);
  const completed = screen.getByRole('heading', { name: 'Completed qualifications' }).parentElement!;
  expect(within(completed).getByText('Master of Science')).toBeInTheDocument();
  expect(within(completed).queryByText('Doctor of Philosophy')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ongoing study' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Study records awaiting confirmation' })).toBeInTheDocument();
  expect(screen.getByText('Retired', { selector: 'dd' })).toBeInTheDocument();
  expect(screen.queryByText('Active', { selector: 'dd' })).not.toBeInTheDocument();
});
it('offers a consultation enquiry without inventing consultation hours', () => {
  render(<MemoryRouter><FacultyProfile /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Email Example Faculty' })).toHaveAttribute('href', 'mailto:example@g.msuiit.edu.ph?subject=Academic%20enquiry%20for%20Example%20Faculty');
  expect(screen.getByText(/confirm availability and the meeting location before visiting/)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Publications' })).not.toBeInTheDocument();
});

it('separates fellowships from degrees and does not invent missing completion years', () => {
  render(<MemoryRouter><FacultyProfile /></MemoryRouter>);
  const experience = screen.getByRole('heading', { name: 'Fellowships and other academic experience' }).parentElement!;
  expect(within(experience).getByText('Academic fellowship')).toBeInTheDocument();
  const completed = screen.getByRole('heading', { name: 'Completed qualifications' }).parentElement!;
  expect(within(completed).queryByText('Academic fellowship')).not.toBeInTheDocument();
  expect(within(completed).getByText('Completed doctorate with year unspecified')).toBeInTheDocument();
});

it('shows confirmed shared roles, source links and a short expandable preview', () => {
  shared.records = Array.from({ length: 4 }, (_, index) => ({ id: index + 1, title: `Shared paper ${index + 1}`, kind: 'publication' as const, year: '2025', role: 'Author', href: `/research/publications#paper-${index + 1}`, withdrawn: false, doi: '' }));
  shared.records.push({ id: 5, title: 'Withdrawn conference paper', kind: 'conference', year: '2026', role: 'Conference paper author (presenter not confirmed)', href: '/research/conferences#conference-paper', withdrawn: true, doi: '' });
  render(<MemoryRouter><FacultyProfile /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Publications' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View full record for Shared paper 1' })).toHaveAttribute('href', '/research/publications#paper-1');
  const overflow = screen.getByText('Shared paper 4').closest('details')!;
  expect(overflow).not.toHaveAttribute('open');
  expect(within(overflow).getByText('View all 4 records')).toBeInTheDocument();
  expect(screen.getByText(/presenter not confirmed.*Withdrawn/)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Extension Projects' })).not.toBeInTheDocument();
});
