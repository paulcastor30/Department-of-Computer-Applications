import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Faculty from '../pages/faculty/Faculty';
vi.mock('@/hooks/usePeople', () => ({ useFaculty: () => ({ data: [
  { id: 1, title: 'Apple Rose B. Alce', slug: 'alce', position: 'Assistant Professor IV', highest_degree: 'Master’s Degree', specialization_areas: 'Embedded Systems', service_classification: 'active_dca_faculty', faculty_category: 'Department faculty', email: 'applerose.alce@g.msuiit.edu.ph' },
  { id: 2, title: 'Leonhel V. Fortin', slug: 'fortin', position: 'Assistant Lecturer', highest_degree: 'Master’s Degree', specialization_areas: 'Data analytics', service_classification: 'active_dca_faculty', faculty_category: 'Lecturer', email: 'leonhel.fortin@g.msuiit.edu.ph' },
  { id: 3, title: 'Ernesto E. Empig', slug: 'empig', service_classification: 'affiliated_msca_faculty', transferred_from_dca: true, home_unit: 'School of Interdisciplinary Studies (SIS)', active_affiliation: true },
  { id: 4, title: 'Joel I. Miano', slug: 'miano', service_classification: 'resigned_dca_faculty', faculty_status: 'resigned', faculty_status_display: 'Resigned', active_affiliation: false },
], isLoading: false, isError: false }) }));
afterEach(cleanup);
it('groups lecturers separately and searches specialization with a clear recovery', () => {
  render(<MemoryRouter><Faculty /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Department faculty' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Lecturers' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Email Apple Rose B. Alce' })).toHaveAttribute('href', 'mailto:applerose.alce@g.msuiit.edu.ph');
  fireEvent.change(screen.getByLabelText('Search faculty and staff'), { target: { value: 'analytics' } });
  expect(screen.queryByText('Apple Rose B. Alce')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Leonhel V. Fortin' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(screen.getByRole('link', { name: 'Apple Rose B. Alce' })).toBeInTheDocument();
});

it('places an active transferred affiliate once, with an accurate count', () => {
  render(<MemoryRouter><Faculty /></MemoryRouter>);
  expect(screen.getAllByRole('link', { name: 'Ernesto E. Empig' })).toHaveLength(1);
  const section = screen.getByRole('heading', { name: 'Graduate affiliates' }).parentElement!;
  expect(within(section).getByRole('link', { name: 'Ernesto E. Empig' })).toHaveAttribute('href', '/faculty/empig');
  expect(screen.queryByRole('heading', { name: 'Transferred faculty' })).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('4 profiles available.');
  fireEvent.change(screen.getByLabelText('Search faculty and staff'), { target: { value: 'interdisciplinary' } });
  expect(screen.getByRole('status')).toHaveTextContent('1 profile match your search.');
});

it('places resigned faculty separately from active and allied groups', () => {
  render(<MemoryRouter><Faculty /></MemoryRouter>);
  const resigned = screen.getByRole('heading', { name: 'Former faculty' }).parentElement!;
  expect(within(resigned).getByRole('link', { name: 'Joel I. Miano' })).toHaveAttribute('href', '/faculty/miano');
  for (const name of ['Department faculty', 'Graduate affiliates']) {
    const group = screen.getByRole('heading', { name }).parentElement!;
    expect(within(group).queryByRole('link', { name: 'Joel I. Miano' })).not.toBeInTheDocument();
  }
});
