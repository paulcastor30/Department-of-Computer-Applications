import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Faculty from '../pages/faculty/Faculty';
vi.mock('@/hooks/usePeople', () => ({ useFaculty: () => ({ data: [
  { id: 1, title: 'Apple Rose B. Alce', slug: 'alce', position: 'Assistant Professor IV', highest_degree: 'Master’s Degree', specialization_areas: 'Embedded Systems', service_classification: 'active_dca_faculty', faculty_category: 'Core faculty', email: 'applerose.alce@g.msuiit.edu.ph' },
  { id: 2, title: 'Leonhel V. Fortin', slug: 'fortin', position: 'Assistant Lecturer', highest_degree: 'Master’s Degree', specialization_areas: 'Data analytics', service_classification: 'active_dca_faculty', faculty_category: 'Lecturer', email: 'leonhel.fortin@g.msuiit.edu.ph' },
  { id: 3, title: 'Ernesto E. Empig', slug: 'empig', service_classification: 'affiliated_msca_faculty', transferred_from_dca: true, home_unit: 'School of Interdisciplinary Studies (SIS)', active_affiliation: true },
], isLoading: false, isError: false }) }));
afterEach(cleanup);
it('groups lecturers separately and searches specialization with a clear recovery', () => {
  render(<MemoryRouter><Faculty /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Core faculty' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Lecturers' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Email Apple Rose B. Alce' })).toHaveAttribute('href', 'mailto:applerose.alce@g.msuiit.edu.ph');
  fireEvent.change(screen.getByLabelText('Search faculty'), { target: { value: 'analytics' } });
  expect(screen.queryByText('Apple Rose B. Alce')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Leonhel V. Fortin' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(screen.getByRole('link', { name: 'Apple Rose B. Alce' })).toBeInTheDocument();
});

it('shows one transferred profile in both relevant groups without counting it twice', () => {
  render(<MemoryRouter><Faculty /></MemoryRouter>);
  const core = screen.getByRole('heading', { name: 'Core faculty' }).parentElement!;
  expect(within(core).queryByRole('link', { name: 'Ernesto E. Empig' })).not.toBeInTheDocument();
  for (const group of ['Affiliated graduate faculty', 'Transferred faculty']) {
    const section = screen.getByRole('heading', { name: group }).parentElement!;
    expect(within(section).getByRole('link', { name: 'Ernesto E. Empig' })).toHaveAttribute('href', '/faculty/empig');
  }
  expect(screen.getByRole('status')).toHaveTextContent('3 profiles available.');
  fireEvent.change(screen.getByLabelText('Search faculty'), { target: { value: 'interdisciplinary' } });
  expect(screen.getByRole('status')).toHaveTextContent('1 profile match your search.');
});
