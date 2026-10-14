import {useState} from 'react';
import {render, screen, fireEvent, cleanup} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
import {AlumniLocationFields} from '@/components/AlumniLocationFields';
const options = {countries:['Canada','Philippines'], philippine_groups:[{name:'Lanao del Norte', cities:['Tubod']}, {name:'Cities outside provinces', cities:['City of Iligan']}, {name:'Metro Manila (NCR)',cities:['City of Manila']}]};
function Example({initial={}}:{initial?:Record<string,string>}) {
  const [values,setValues]=useState(initial);
  return <AlumniLocationFields prefix="residence" options={options} values={values} onChange={(key,value)=>setValues(previous=>({...previous,[key]:value}))}/>;
}
afterEach(cleanup);
it('filters Philippine cities, handles independent cities and clears mismatched selections',()=>{
  render(<Example/>);
  fireEvent.change(screen.getByLabelText('Current country (optional)'),{target:{value:'Philippines'}});
  expect(screen.getByLabelText('Current city or municipality (optional)')).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Current province or region (optional)'),{target:{value:'Lanao del Norte'}});
  expect(screen.getByRole('option',{name:'Tubod'})).toBeInTheDocument();
  expect(screen.queryByRole('option',{name:'City of Iligan'})).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Current city or municipality (optional)'),{target:{value:'Tubod'}});
  fireEvent.change(screen.getByLabelText('Current province or region (optional)'),{target:{value:'Cities outside provinces'}});
  expect(screen.getByLabelText('Current city or municipality (optional)')).toHaveValue('');
  expect(screen.getByRole('option',{name:'City of Iligan'})).toBeInTheDocument();
});
it('permits overseas places and preserves existing nonstandard answers',()=>{
  const {rerender}=render(<Example initial={{residence_country:'Canada',residence_city:'Toronto',residence_province:'Ontario'}}/>);
  expect(screen.getByLabelText('Current city (optional)')).toHaveValue('Toronto');
  expect(screen.getByLabelText('Current state or province (optional)')).toHaveValue('Ontario');
  rerender(<Example key="legacy" initial={{residence_country:'Philippines',residence_city:'Iligan',residence_province:''}}/>);
  expect(screen.getByLabelText('Current city or municipality (optional)')).toHaveValue('Iligan');
  expect(screen.getByRole('option',{name:'Iligan'})).toBeInTheDocument();
});
it('provides an unlisted-place option without requiring a false city match',()=>{
  render(<Example initial={{residence_country:'Philippines',residence_province:'Lanao del Norte'}}/>);
  fireEvent.change(screen.getByLabelText('Current city or municipality (optional)'),{target:{value:'__other__'}});
  fireEvent.change(screen.getByLabelText('City or municipality name'),{target:{value:'Newly renamed place'}});
  expect(screen.getByLabelText('City or municipality name')).toHaveValue('Newly renamed place');
});
it('does not infer a province from a saved city when the province was not supplied',()=>{
  render(<Example initial={{residence_country:'Philippines',residence_city:'Tubod'}}/>);
  expect(screen.getByLabelText('Current province or region (optional)')).toHaveValue('');
  expect(screen.getByLabelText('Current city or municipality (optional)')).toHaveValue('Tubod');
});
