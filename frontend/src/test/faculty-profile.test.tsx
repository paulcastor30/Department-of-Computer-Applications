import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FacultyProfile from '../pages/faculty/FacultyProfile';
vi.mock('@/hooks/usePeople', () => ({ useFacultyMember: () => ({ data: {
  title: 'Example Faculty', position: 'Professor', service_classification: 'retired_dca_faculty', service_classification_display: 'Retired DCA Faculty', faculty_status_display: 'Active', email: 'example@g.msuiit.edu.ph', profile_summary: 'Academic profile.', highest_degree: 'Master’s Degree',
  education_records: [
    { id: 1, degree_name: 'Master of Science', institution: 'University', year_completed: 2020, notes: '' },
    { id: 2, degree_name: 'Doctor of Philosophy', institution: 'University', year_completed: null, notes: 'Ongoing study; degree not yet completed.' },
    { id: 3, degree_name: 'Doctor of Engineering', institution: 'University', year_completed: null, notes: 'Completion status to be validated by the Department.' },
  ], expertise_records: [], supervised_works: [], publications: [], conferences: [], research_projects: [], extension_projects: [], creative_works: [], training_seminars: [], achievements: [],
}, isLoading: false, isError: false }) }));
afterEach(cleanup);
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
