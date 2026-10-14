import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,expect,it,vi} from 'vitest';
import {UpcomingDatesPreview} from '@/components/UpcomingDatesPreview';
const hooks=vi.hoisted(()=>({useEvents:vi.fn()}));
vi.mock('@/hooks/useCommunications',()=>hooks);
afterEach(cleanup);
it('shows recorded dates and keeps conference records distinctly labelled',()=>{
  hooks.useEvents.mockReturnValue({data:{results:[{id:'conference',label:'Research conference dates',status:'',title:'Paper record',starts_on:'2026-10-27',ends_on:'2026-10-30',href:'/research/conferences#paper'}]},isPending:false,isError:false});
  const {container}=render(<MemoryRouter><UpcomingDatesPreview/></MemoryRouter>);
  expect(screen.getByText('Research conference dates')).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Paper record'})).toHaveAttribute('href','/research/conferences#paper');
  expect(container.querySelector('time[datetime="2026-10-27"]')).toBeInTheDocument();
});
it('handles empty dates and offers recovery when the API fails',()=>{
  hooks.useEvents.mockReturnValue({data:{results:[]},isPending:false,isError:false});
  const {rerender}=render(<MemoryRouter><UpcomingDatesPreview/></MemoryRouter>);
  expect(screen.getByText('No upcoming dates are currently listed.')).toBeInTheDocument();
  const refetch=vi.fn();hooks.useEvents.mockReturnValue({isPending:false,isError:true,refetch});
  rerender(<MemoryRouter><UpcomingDatesPreview/></MemoryRouter>);
  fireEvent.click(screen.getByRole('button',{name:'Try again'}));expect(refetch).toHaveBeenCalledOnce();
});
