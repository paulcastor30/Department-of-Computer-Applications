import { useState } from "react";
import type { AlumniConfiguration } from "@/hooks/useAlumni";
const control = "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2";

export function AlumniLocationFields({prefix, options, values, onChange}: {
  prefix: "residence" | "work";
  options: AlumniConfiguration["location_options"];
  values: Record<string,string>;
  onChange: (field: string, value: string) => void;
}) {
  const [otherCountry, setOtherCountry] = useState(false);
  const [otherCity, setOtherCity] = useState(false);
  const [outsideGroup, setOutsideGroup] = useState("");
  const country = values[`${prefix}_country`] || "";
  const province = values[`${prefix}_province`] || "";
  const city = values[`${prefix}_city`] || "";
  const countries = options?.countries || [];
  const groups = options?.philippine_groups || [];
  const selectedArea = province || outsideGroup || groups.find(group => ["Cities outside provinces", "Metro Manila (NCR)"].includes(group.name) && group.cities.includes(city))?.name || "";
  const cities = groups.find(group => group.name === selectedArea)?.cities || [];
  const philippines = country === "Philippines" && !otherCountry;
  const label = prefix === "residence" ? "Current" : "Work";
  function changeCountry(value: string) {
    setOtherCountry(value === "__other__"); setOtherCity(false); setOutsideGroup("");
    onChange(`${prefix}_country`, value === "__other__" ? "" : value);
    onChange(`${prefix}_province`, ""); onChange(`${prefix}_city`, "");
  }
  return <div className="grid gap-4 sm:grid-cols-2">
    <div><label className="mb-2 block" htmlFor={`${prefix}-country`}>{label} country (optional)</label>
      <select id={`${prefix}-country`} className={control} value={otherCountry ? "__other__" : country} onChange={e => changeCountry(e.target.value)}>
        <option value="">Choose a country or territory</option>
        {country && !countries.includes(country) && !otherCountry && <option value={country}>{country}</option>}
        {countries.map(name => <option key={name} value={name}>{name}</option>)}
        <option value="__other__">Other country or territory</option>
      </select>
      {otherCountry && <><label className="mb-2 mt-3 block" htmlFor={`${prefix}-other-country`}>Country or territory name</label><input id={`${prefix}-other-country`} className={control} maxLength={100} value={country} onChange={e => onChange(`${prefix}_country`, e.target.value)} /></>}
    </div>
    {philippines ? <>
      <div><label className="mb-2 block" htmlFor={`${prefix}-province`}>{label} province or region (optional)</label><select id={`${prefix}-province`} className={control} value={selectedArea} onChange={e => { const value = e.target.value; const outside = ["Cities outside provinces", "Metro Manila (NCR)"].includes(value); setOutsideGroup(outside ? value : ""); onChange(`${prefix}_province`, outside ? "" : value); onChange(`${prefix}_city`, ""); setOtherCity(false); }}>
        <option value="">Choose a province or region</option>{province && !groups.some(g => g.name === province) && <option value={province}>{province}</option>}
        {groups.map(group => <option key={group.name} value={group.name}>{group.name}</option>)}
      </select></div>
      <div><label className="mb-2 block" htmlFor={`${prefix}-city`}>{label} city or municipality (optional)</label><select id={`${prefix}-city`} className={control} disabled={!selectedArea && !city} value={otherCity ? "__other__" : city} onChange={e => {setOtherCity(e.target.value === "__other__"); onChange(`${prefix}_city`, e.target.value === "__other__" ? "" : e.target.value);}}>
        <option value="">{selectedArea ? "Choose a city or municipality" : "Choose a province or region first"}</option>
        {city && !cities.includes(city) && !otherCity && <option value={city}>{city}</option>}
        {cities.map(name => <option key={name} value={name}>{name}</option>)}<option value="__other__">My city or municipality is not listed</option>
      </select>{otherCity && <><label className="mb-2 mt-3 block" htmlFor={`${prefix}-other-city`}>City or municipality name</label><input id={`${prefix}-other-city`} className={control} maxLength={150} value={city} onChange={e => onChange(`${prefix}_city`, e.target.value)} /></>}</div>
    </> : (country || city || province) && <>
      <div><label className="mb-2 block" htmlFor={`${prefix}-province`}>{label} state or province (optional)</label><input id={`${prefix}-province`} className={control} maxLength={150} value={province} onChange={e => onChange(`${prefix}_province`, e.target.value)} /></div>
      <div><label className="mb-2 block" htmlFor={`${prefix}-city`}>{label} city (optional)</label><input id={`${prefix}-city`} className={control} maxLength={150} value={city} onChange={e => onChange(`${prefix}_city`, e.target.value)} /></div>
    </>}
    {philippines && <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">For an independent city, choose “Cities outside provinces”; for Metro Manila, choose “Metro Manila (NCR)”. <a className="text-link" href="https://psgc.cloud/">Location reference: PSGC Cloud</a>.</p>}
  </div>;
}
