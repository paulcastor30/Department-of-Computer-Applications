import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Faculty from '../pages/faculty/Faculty';
vi.mock('@/hooks/usePeople', () => ({ useFaculty: () => ({ data: [
  { id: 1, title: 'Apple Rose B. Alce', slug: 'alce', position: 'Assistant Professor IV', highest_degree: 'Master’s Degree', specialization_areas: 'Embedded Systems', service_classification: 'active_dca_faculty', faculty_category: 'Core faculty', email: 'applerose.alce@g.msuiit.edu.ph' },
  { id: 2, title: 'Leonhel V. Fortin', slug: 'fortin', position: 'Assistant Lecturer', highest_degree: 'Master’s Degree', specialization_areas: 'Data analytics', service_classification: 'active_dca_faculty', faculty_category: 'Lecturer', email: 'leonhel.fortin@g.msuiit.edu.ph' },
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
