import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

it('lets visitors reach all six questions without waiting for news', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'Computer Applications' })).toBeInTheDocument();
  for (const title of ['Who we are', 'What you can study', 'When things happen', 'Where to find us', 'Why our work matters', 'How to get started']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
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
  fireEvent.click(screen.getByRole('link', { name: /Who we are/ }));
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

it('takes the Why question directly to the purpose section', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: /Why our work matters/ }));
  await screen.findByRole('heading', { name: 'Why we do this work' });
  await waitFor(() => expect(document.getElementById('purpose')).toHaveFocus());
});
