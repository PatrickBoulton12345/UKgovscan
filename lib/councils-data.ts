export type CouncilType = 'County' | 'District' | 'Metropolitan' | 'Unitary' | 'London Borough'

export type Region =
  | 'East' | 'West Midlands' | 'North West' | 'South East' | 'South West'
  | 'London' | 'North East' | 'Yorkshire' | 'East Midlands'

export interface FlyTipping {
  incidents: number
  fpns: number
  rate: number
}

export interface CouncilFinance {
  expenditure?: number   // total revenue expenditure (£)
  councilTax?: number    // council tax revenue (£)
  fpnRevenue?: number    // estimated FPN revenue (£)
}

export interface Council {
  name: string
  slug: string
  region: Region
  type: CouncilType
  flyTipping?: FlyTipping
  finance?: CouncilFinance
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// FPN revenue estimated at £400 per notice (standard rate; councils can set £150-£1000)
const FPN_STANDARD_FINE = 400

function withSlugAndRevenue(
  name: string,
  region: Region,
  type: CouncilType,
  flyTipping?: FlyTipping,
  finance?: Omit<CouncilFinance, 'fpnRevenue'>
): Council {
  return {
    name,
    slug: slugify(name),
    region,
    type,
    flyTipping,
    finance: finance
      ? { ...finance, fpnRevenue: flyTipping ? flyTipping.fpns * FPN_STANDARD_FINE : undefined }
      : flyTipping
        ? { fpnRevenue: flyTipping.fpns * FPN_STANDARD_FINE }
        : undefined,
  }
}

// MHCLG Revenue Outturn 2024-25 (expenditure in £000s → ×1000)
// MHCLG CTR1 Table 9 2024-25 (council tax requirement in £)
export const COUNCILS: Council[] = [
  // London Boroughs
  withSlugAndRevenue('Barnet', 'London', 'London Borough', { incidents: 6938, fpns: 409, rate: 5.90 }, { expenditure: 769_481_000, councilTax: 229_355_382 }),
  withSlugAndRevenue('Camden', 'London', 'London Borough', { incidents: 36216, fpns: 1169, rate: 3.23 }, { expenditure: 663_527_000, councilTax: 141_130_750 }),
  withSlugAndRevenue('Croydon', 'London', 'London Borough', { incidents: 53268, fpns: 23, rate: 0.04 }, { expenditure: 760_972_000, councilTax: 259_761_448 }),
  withSlugAndRevenue('Ealing', 'London', 'London Borough', { incidents: 25394, fpns: 2429, rate: 9.57 }),
  withSlugAndRevenue('Enfield', 'London', 'London Borough', { incidents: 9218, fpns: 4712, rate: 51.12 }),
  withSlugAndRevenue('Hackney', 'London', 'London Borough', { incidents: 31042, fpns: 106, rate: 0.34 }, { expenditure: 780_108_000, councilTax: 109_337_928 }),
  withSlugAndRevenue('Hammersmith and Fulham', 'London', 'London Borough', { incidents: 8087, fpns: 2164, rate: 26.76 }),
  withSlugAndRevenue('Hounslow', 'London', 'London Borough', { incidents: 25177, fpns: 4, rate: 0.02 }),
  withSlugAndRevenue('Islington', 'London', 'London Borough', { incidents: 3330, fpns: 772, rate: 23.18 }),
  withSlugAndRevenue('Lambeth', 'London', 'London Borough', { incidents: 21220, fpns: 925, rate: 4.36 }),
  withSlugAndRevenue('Lewisham', 'London', 'London Borough', { incidents: 33471, fpns: 748, rate: 2.23 }),
  withSlugAndRevenue('Newham', 'London', 'London Borough', { incidents: 26502, fpns: 14502, rate: 54.72 }),
  withSlugAndRevenue('Southwark', 'London', 'London Borough', { incidents: 18530, fpns: 555, rate: 3.00 }),
  withSlugAndRevenue('Tower Hamlets', 'London', 'London Borough', { incidents: 6029, fpns: 426, rate: 7.07 }),
  withSlugAndRevenue('Wandsworth', 'London', 'London Borough', { incidents: 5580, fpns: 1828, rate: 32.76 }),
  withSlugAndRevenue('Westminster', 'London', 'London Borough', { incidents: 20047, fpns: 2522, rate: 12.58 }),
  withSlugAndRevenue('Brent', 'London', 'London Borough', { incidents: 16338, fpns: 3655, rate: 22.37 }),
  withSlugAndRevenue('Waltham Forest', 'London', 'London Borough', { incidents: 10246, fpns: 2755, rate: 26.89 }),
  withSlugAndRevenue('Kensington and Chelsea', 'London', 'London Borough', { incidents: 7613, fpns: 2163, rate: 28.41 }),

  // Metropolitan
  withSlugAndRevenue('Birmingham', 'West Midlands', 'Metropolitan', { incidents: 24664, fpns: 153, rate: 0.62 }, { councilTax: 482_348_571 }), // expenditure suppressed — Section 114
  withSlugAndRevenue('Leeds', 'Yorkshire', 'Metropolitan', { incidents: 13923, fpns: 83, rate: 0.60 }, { expenditure: 1_700_063_000, councilTax: 421_490_714 }),
  withSlugAndRevenue('Manchester', 'North West', 'Metropolitan', { incidents: 14963, fpns: 992, rate: 6.63 }, { expenditure: 1_327_674_000, councilTax: 229_259_492 }),
  withSlugAndRevenue('Liverpool', 'North West', 'Metropolitan', { incidents: 20300, fpns: 0, rate: 0.00 }, { expenditure: 1_345_120_000, councilTax: 235_103_456 }),
  withSlugAndRevenue('Sheffield', 'Yorkshire', 'Metropolitan', { incidents: 12237, fpns: 129, rate: 1.05 }, { expenditure: 1_164_879_000, councilTax: 284_713_441 }),
  withSlugAndRevenue('Bradford', 'Yorkshire', 'Metropolitan', { incidents: 19697, fpns: 91, rate: 0.46 }),
  withSlugAndRevenue('Coventry', 'West Midlands', 'Metropolitan', { incidents: 7188, fpns: 199, rate: 2.77 }, { expenditure: 686_129_000, councilTax: 175_897_581 }),
  withSlugAndRevenue('Newcastle upon Tyne', 'North East', 'Metropolitan', { incidents: 16731, fpns: 157, rate: 0.94 }, { expenditure: 599_512_000, councilTax: 140_584_999 }),
  withSlugAndRevenue('Sunderland', 'North East', 'Metropolitan', { incidents: 9481, fpns: 95, rate: 1.00 }, { expenditure: 551_071_000, councilTax: 128_086_782 }),
  withSlugAndRevenue('Wirral', 'North West', 'Metropolitan', { incidents: 7977, fpns: 0, rate: 0.00 }),
  withSlugAndRevenue('Sandwell', 'West Midlands', 'Metropolitan', { incidents: 12542, fpns: 28, rate: 0.22 }),

  // Unitary
  withSlugAndRevenue('Bristol', 'South West', 'Unitary', { incidents: 10266, fpns: 217, rate: 2.11 }, { expenditure: 881_082_000, councilTax: 282_398_335 }),
  withSlugAndRevenue('Brighton and Hove', 'South East', 'Unitary', { incidents: 1627, fpns: 390, rate: 23.97 }, { expenditure: 621_633_000, councilTax: 185_147_980 }),
  withSlugAndRevenue('Milton Keynes', 'South East', 'Unitary', { incidents: 4258, fpns: 115, rate: 2.70 }),
  withSlugAndRevenue('Reading', 'South East', 'Unitary', { incidents: 2229, fpns: 221, rate: 9.91 }, { expenditure: 343_990_000, councilTax: 118_884_447 }),
  withSlugAndRevenue('Plymouth', 'South West', 'Unitary', { incidents: 5370, fpns: 281, rate: 5.23 }, { expenditure: 467_256_000, councilTax: 138_767_778 }),
  withSlugAndRevenue('Derby', 'East Midlands', 'Unitary', { incidents: 6477, fpns: 182, rate: 2.81 }, { expenditure: 482_142_000, councilTax: 124_961_350 }),
  withSlugAndRevenue('Leicester', 'East Midlands', 'Unitary', { incidents: 6966, fpns: 230, rate: 3.30 }, { expenditure: 768_088_000, councilTax: 153_587_399 }),
  withSlugAndRevenue('Nottingham', 'East Midlands', 'Unitary', { incidents: 26138, fpns: 973, rate: 3.72 }, { expenditure: 703_846_000, councilTax: 148_879_420 }),
  withSlugAndRevenue('Peterborough', 'East', 'Unitary', { incidents: 10474, fpns: 247, rate: 2.36 }),
  withSlugAndRevenue('Stoke-on-Trent', 'West Midlands', 'Unitary', { incidents: 5893, fpns: 2109, rate: 35.79 }),
  withSlugAndRevenue('Luton', 'East', 'Unitary', { incidents: 11599, fpns: 144, rate: 1.24 }),
  withSlugAndRevenue('Southampton', 'South East', 'Unitary', { incidents: 12208, fpns: 38, rate: 0.31 }),
  withSlugAndRevenue('Thurrock', 'East', 'Unitary', { incidents: 3037, fpns: 1112, rate: 36.62 }),

  // County (no fly tipping data — waste is handled at district level)
  withSlugAndRevenue('Kent', 'South East', 'County'),
  withSlugAndRevenue('Essex', 'East', 'County'),
  withSlugAndRevenue('Hampshire', 'South East', 'County'),
  withSlugAndRevenue('Surrey', 'South East', 'County'),
  withSlugAndRevenue('Lancashire', 'North West', 'County'),
  withSlugAndRevenue('Suffolk', 'East', 'County'),
  withSlugAndRevenue('Oxfordshire', 'South East', 'County'),
  withSlugAndRevenue('Cambridgeshire', 'East', 'County'),
  withSlugAndRevenue('Gloucestershire', 'South West', 'County'),
  withSlugAndRevenue('Lincolnshire', 'East Midlands', 'County'),
  withSlugAndRevenue('Staffordshire', 'West Midlands', 'County'),
  withSlugAndRevenue('Norfolk', 'East', 'County'),

  // District
  withSlugAndRevenue('Breckland', 'East', 'District', { incidents: 830, fpns: 24, rate: 2.89 }),
  withSlugAndRevenue('Cherwell', 'South East', 'District', { incidents: 1332, fpns: 29, rate: 2.18 }),
  withSlugAndRevenue('Pendle', 'North West', 'District', { incidents: 6186, fpns: 81, rate: 1.31 }),
  withSlugAndRevenue('South Cambridgeshire', 'East', 'District', { incidents: 943, fpns: 47, rate: 4.98 }),
  withSlugAndRevenue('Waverley', 'South East', 'District', { incidents: 715, fpns: 1, rate: 0.14 }),
  withSlugAndRevenue('New Forest', 'South East', 'District', { incidents: 1361, fpns: 852, rate: 62.60 }),
  withSlugAndRevenue('Boston', 'East Midlands', 'District', { incidents: 4687, fpns: 67, rate: 1.43 }),
]

// Compute national FPN rankings (1 = highest enforcement rate)
export function getFpnRanking(council: Council): number | null {
  if (!council.flyTipping) return null
  const withRates = COUNCILS
    .filter((c) => c.flyTipping)
    .sort((a, b) => (b.flyTipping!.rate) - (a.flyTipping!.rate))
  const idx = withRates.findIndex((c) => c.slug === council.slug)
  return idx >= 0 ? idx + 1 : null
}

export function getTotalRankedCouncils(): number {
  return COUNCILS.filter((c) => c.flyTipping).length
}

export function getCouncilBySlug(slug: string): Council | undefined {
  return COUNCILS.find((c) => c.slug === slug)
}

export function rateColour(rate: number): string {
  if (rate >= 20) return 'text-green-600'
  if (rate >= 5) return 'text-lfg-orange'
  if (rate > 0) return 'text-red-500'
  return 'text-red-700'
}

export const REGIONS: Array<'All' | Region> = [
  'All', 'East', 'East Midlands', 'London', 'North East', 'North West',
  'South East', 'South West', 'West Midlands', 'Yorkshire',
]

export const TYPES: Array<'All' | CouncilType> = [
  'All', 'County', 'District', 'London Borough', 'Metropolitan', 'Unitary',
]

export const TYPE_BADGE: Record<CouncilType, string> = {
  County: 'bg-lfg-orange/10 text-lfg-orange border border-lfg-orange/30',
  District: 'bg-gray-100 text-gray-600 border border-gray-200',
  Metropolitan: 'bg-lfg-blue/10 text-teal-700 border border-lfg-blue/30',
  Unitary: 'bg-lfg-yellow/10 text-amber-700 border border-lfg-yellow/30',
  'London Borough': 'bg-lfg-black/5 text-lfg-black border border-lfg-black/20',
}
