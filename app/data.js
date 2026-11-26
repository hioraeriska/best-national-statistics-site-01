// Indonesia in Numbers — the figures behind this site.
// Every number below is a published figure from the source named next to it.
// Reference year is 2024 unless a row says otherwise. Figures are rounded
// for display; the notes give the unrounded value where it matters.

export const COUNTRY = {
  name: 'Indonesia',
  nameId: 'Republik Indonesia',
  motto: 'Bhinneka Tunggal Ika — Unity in Diversity',
  capital: 'Jakarta',
  capitalNote: 'The new capital, Nusantara, is under construction in East Kalimantan.',
  areaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  languages: '700+',
  currency: 'Indonesian rupiah (IDR)',
  timezone: 'WIB / WITA / WIT (UTC+7 to UTC+9)',
  independence: '17 August 1945',
};

export const KPIS = [
  { label: 'Population', value: '283.5M', sub: '4th largest in the world', source: 'World Bank WDI, 2024' },
  { label: 'GDP', value: '$1.40T', sub: '16th largest economy', source: 'World Bank WDI, 2024' },
  { label: 'GDP per capita', value: '$4,925', sub: 'Upper-middle income', source: 'World Bank WDI, 2024' },
  { label: 'GDP growth', value: '5.0%', sub: 'Real growth, 2024', source: 'World Bank / BPS, 2024' },
  { label: 'Life expectancy', value: '71.3 yrs', sub: 'At birth, 2024', source: 'World Bank WDI, 2024' },
  { label: 'Human Development Index', value: '0.728', sub: 'High human development', source: 'UNDP HDR, 2023' },
  { label: 'Poverty rate', value: '8.57%', sub: '24.06 million people', source: 'BPS, Sep 2024' },
  { label: 'Unemployment', value: '4.76%', sub: 'Open unemployment', source: 'BPS, Feb 2025' },
];

// Population, millions — World Bank WDI series (2024: 283.5).
export const POPULATION_SERIES = [
  { year: 2015, value: 258.4 }, { year: 2016, value: 261.6 },
  { year: 2017, value: 264.7 }, { year: 2018, value: 267.7 },
  { year: 2019, value: 270.6 }, { year: 2020, value: 273.5 },
  { year: 2021, value: 276.4 }, { year: 2022, value: 279.1 },
  { year: 2023, value: 282.1 }, { year: 2024, value: 283.5 },
];

// GDP, current US$ billions — World Bank WDI.
export const GDP_SERIES = [
  { year: 2015, value: 861 }, { year: 2016, value: 932 },
  { year: 2017, value: 1016 }, { year: 2018, value: 1042 },
  { year: 2019, value: 1119 }, { year: 2020, value: 1059 },
  { year: 2021, value: 1187 }, { year: 2022, value: 1319 },
  { year: 2023, value: 1371 }, { year: 2024, value: 1406 },
];

// Real GDP growth, % per year — World Bank WDI.
export const GROWTH_SERIES = [
  { year: 2015, value: 4.9 }, { year: 2016, value: 5.0 },
  { year: 2017, value: 5.1 }, { year: 2018, value: 5.2 },
  { year: 2019, value: 5.0 }, { year: 2020, value: -2.1 },
  { year: 2021, value: 3.7 }, { year: 2022, value: 5.3 },
  { year: 2023, value: 5.0 }, { year: 2024, value: 5.0 },
];

// GDP per capita, current US$ — World Bank WDI.
export const GDP_PC_SERIES = [
  { year: 2015, value: 3334 }, { year: 2016, value: 3563 },
  { year: 2017, value: 3838 }, { year: 2018, value: 3894 },
  { year: 2019, value: 4135 }, { year: 2020, value: 3872 },
  { year: 2021, value: 4293 }, { year: 2022, value: 4726 },
  { year: 2023, value: 4860 }, { year: 2024, value: 4933 },
];

// Age structure, % of population — World Bank WDI, 2024.
export const AGE_STRUCTURE = [
  { label: 'Ages 0–14', value: 24.6, note: '69.7 million children' },
  { label: 'Ages 15–64', value: 68.1, note: '193.1 million working age' },
  { label: 'Ages 65+', value: 7.3, note: '20.7 million older people' },
];

// Religion, % of population — Ministry of Home Affairs, 2023.
export const RELIGION = [
  { label: 'Islam', value: 87.1 },
  { label: 'Protestant Christianity', value: 7.4 },
  { label: 'Catholic Christianity', value: 3.1 },
  { label: 'Hinduism', value: 1.7 },
  { label: 'Buddhism', value: 0.7 },
  { label: 'Confucianism & others', value: 0.03 },
];

// Largest sectors by share of GDP, % — BPS, 2024. The five named sectors
// sum to 61.8%; the rest is grouped as "all other sectors".
export const SECTORS = [
  { label: 'Manufacturing', value: 19.0 },
  { label: 'Wholesale & retail trade', value: 12.8 },
  { label: 'Agriculture, forestry & fishing', value: 12.5 },
  { label: 'Construction', value: 9.8 },
  { label: 'Mining & quarrying', value: 7.7 },
  { label: 'All other sectors', value: 38.2 },
];

// Poverty rate, % — BPS, March each year.
export const POVERTY_SERIES = [
  { year: 2019, value: 9.41 }, { year: 2020, value: 9.78 },
  { year: 2021, value: 10.14 }, { year: 2022, value: 9.54 },
  { year: 2023, value: 9.36 }, { year: 2024, value: 9.03 },
  { year: 2025, value: 8.47 },
];

// Open unemployment rate, % — BPS, August each year (2025: February).
export const UNEMPLOYMENT_SERIES = [
  { year: 2019, value: 5.23 }, { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 }, { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 }, { year: 2024, value: 4.91 },
  { year: 2025, value: 4.76 },
];

// Consumer price inflation, annual average % — BPS / IMF.
export const INFLATION_SERIES = [
  { year: 2019, value: 2.8 }, { year: 2020, value: 2.0 },
  { year: 2021, value: 1.6 }, { year: 2022, value: 5.5 },
  { year: 2023, value: 3.7 }, { year: 2024, value: 2.3 },
];

// Trade and investment, 2024.
export const TRADE = [
  { label: 'Exports of goods', value: '$264.7B', source: 'BPS, 2024' },
  { label: 'Imports of goods', value: '$233.7B', source: 'BPS, 2024' },
  { label: 'Trade balance', value: '+$31.0B', source: 'BPS, 2024 (surplus)' },
  { label: 'Foreign direct investment', value: '$24.2B', source: 'World Bank, 2024' },
];

// Ten largest provinces, population mid-2024 — BPS estimates.
export const PROVINCES = [
  { name: 'West Java', capital: 'Bandung', island: 'Java', population: 50.3, density: 1359 },
  { name: 'East Java', capital: 'Surabaya', island: 'Java', population: 41.8, density: 876 },
  { name: 'Central Java', capital: 'Semarang', island: 'Java', population: 37.9, density: 1104 },
  { name: 'North Sumatra', capital: 'Medan', island: 'Sumatra', population: 15.6, density: 215 },
  { name: 'Banten', capital: 'Serang', island: 'Java', population: 11.8, density: 1341 },
  { name: 'Jakarta', capital: 'Jakarta', island: 'Java', population: 10.7, density: 16165 },
  { name: 'South Sulawesi', capital: 'Makassar', island: 'Sulawesi', population: 9.5, density: 203 },
  { name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatra', population: 9.4, density: 262 },
  { name: 'South Sumatra', capital: 'Palembang', island: 'Sumatra', population: 8.8, density: 100 },
  { name: 'Riau', capital: 'Pekanbaru', island: 'Sumatra', population: 6.7, density: 75 },
];

// Island groups, population mid-2024 — BPS estimates. These sum to the BPS
// national total of 281.6 million; the World Bank figure used elsewhere on
// this site is 283.5 million (different vintage, same year).
export const ISLAND_GROUPS = [
  { group: 'Java', population: 156.9, share: 55.7, note: 'Six provinces, incl. Jakarta' },
  { group: 'Sumatra', population: 61.5, share: 21.8, note: 'Ten provinces' },
  { group: 'Kalimantan', population: 17.7, share: 6.3, note: 'Five provinces, incl. Nusantara' },
  { group: 'Sulawesi', population: 20.3, share: 7.2, note: 'Six provinces' },
  { group: 'Bali & Nusa Tenggara', population: 15.7, share: 5.6, note: 'Three provinces' },
  { group: 'Maluku & Papua', population: 9.6, share: 3.4, note: 'Ten provinces' },
];

// Health, 2024 unless noted.
export const HEALTH = [
  { label: 'Life expectancy at birth', value: '71.3 years', source: 'World Bank WDI, 2024' },
  { label: 'Under-5 mortality', value: '21 per 1,000', source: 'World Bank / UN IGME, 2023' },
  { label: 'Maternal mortality', value: '173 per 100,000', source: 'WHO, 2020' },
  { label: 'Health spending', value: '3.7% of GDP', source: 'World Bank, 2021' },
  { label: 'Under-5 stunting', value: '19.8%', source: 'BPS / SSGI, 2024' },
  { label: 'Access to electricity', value: '99.9%', source: 'World Bank, 2024' },
];

// Education, 2024 unless noted.
export const EDUCATION = [
  { label: 'Adult literacy (15+)', value: '96.4%', source: 'UNESCO, 2022' },
  { label: 'Mean years of schooling', value: '9.0 years', source: 'BPS, 2024' },
  { label: 'Expected years of schooling', value: '13.6 years', source: 'UNDP HDR, 2023' },
  { label: 'Primary net enrolment', value: '99.4%', source: 'BPS, 2023' },
  { label: 'Internet users', value: '221.6 million', source: 'APJII, 2024' },
  { label: 'Youth literacy (15–24)', value: '99.7%', source: 'BPS, 2023' },
];

// Environment and geography.
export const ENVIRONMENT = [
  { label: 'Forest area', value: '50.7% of land', source: 'World Bank, 2024' },
  { label: 'Land area', value: '1.90M km²', source: 'World Bank, 2024' },
  { label: 'Islands', value: '17,508', source: 'Government of Indonesia' },
  { label: 'Highest point', value: 'Puncak Jaya, 4,884 m', source: 'Papua highlands' },
  { label: 'Longest river', value: 'Kapuas, 1,143 km', source: 'West Kalimantan' },
  { label: 'Rainforest share', value: '3rd largest tropical forest', source: 'After Brazil & DR Congo' },
];

export const SOURCES = [
  { publisher: 'World Bank', items: [
    'World Development Indicators — population, GDP, GDP per capita, growth, life expectancy, age structure, FDI (2024)',
    'World Bank country data — electricity access, forest area (2024)',
  ]},
  { publisher: 'BPS — Statistics Indonesia', items: [
    'Poverty profile March 2025 — poverty 8.47% (Mar 2025), 8.57% (Sep 2024)',
    'Labour force survey — open unemployment 4.76% (Feb 2025)',
    'Provincial population estimates, mid-2024',
    'Exports $264.7B and imports $233.7B (2024)',
  ]},
  { publisher: 'UNDP', items: [
    'Human Development Report 2023–24 — HDI 0.728, expected years of schooling 13.6',
  ]},
  { publisher: 'WHO / UN IGME', items: [
    'Maternal mortality 173 per 100,000 live births (2020)',
    'Under-5 mortality, approx. 21 per 1,000 live births (2023)',
  ]},
  { publisher: 'Other', items: [
    'Ministry of Home Affairs — religious composition, 2023',
    'APJII Internet survey — 221.6 million users, 2024',
    'UNESCO Institute for Statistics — adult literacy, 2022',
    'Government of Indonesia — 17,508 islands; Puncak Jaya and Kapuas river figures',
  ]},
];
