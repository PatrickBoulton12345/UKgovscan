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
  expenditure?: number      // total revenue expenditure (£) — MHCLG RS
  councilTax?: number       // council tax requirement (£) — MHCLG CTR1
  fpnRevenue?: number       // estimated FPN revenue (£) — calculated
  parkingIncome?: number    // total parking income (£) — MHCLG RO2
  parkingSurplus?: number   // parking surplus after costs (£) — MHCLG RO2
  pcnIncome?: number        // PCN (parking fine) income (£) — MHCLG RO2
  businessRates?: number    // retained business rates (£) — MHCLG RS
  govGrants?: number        // total government grants (£) — MHCLG RS (RSG + specific)
  feesCharges?: number      // sales, fees & charges (£) — MHCLG RSX
  totalDebt?: number        // total outstanding borrowing (£) — MHCLG Borrowing Live Table Q3 25-26
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
  withSlugAndRevenue('Barnet', 'London', 'London Borough', { incidents: 6938, fpns: 409, rate: 5.90 }, { expenditure: 769_481_000, councilTax: 229_355_382, parkingIncome: 27_267_000, parkingSurplus: 15_334_000, pcnIncome: 4_570_000, businessRates: 81_686_000, govGrants: 434_939_000, feesCharges: 99_326_000, totalDebt: 1_227_987_000 }),
  withSlugAndRevenue('Camden', 'London', 'London Borough', { incidents: 36216, fpns: 1169, rate: 3.23 }, { expenditure: 663_527_000, councilTax: 141_130_750, parkingIncome: 49_849_000, parkingSurplus: 32_280_000, pcnIncome: 20_624_000, businessRates: 108_192_000, govGrants: 369_983_000, feesCharges: 118_279_000, totalDebt: 294_281_000 }),
  withSlugAndRevenue('Croydon', 'London', 'London Borough', { incidents: 53268, fpns: 23, rate: 0.04 }, { expenditure: 760_972_000, councilTax: 259_761_448, parkingIncome: 28_223_000, parkingSurplus: 18_582_000, pcnIncome: 17_998_000, businessRates: 99_251_000, govGrants: 365_263_000, feesCharges: 156_348_000, totalDebt: 1_510_926_000 }),
  withSlugAndRevenue('Ealing', 'London', 'London Borough', { incidents: 25394, fpns: 2429, rate: 9.57 }, { expenditure: 807_715_000, councilTax: 181_825_000, parkingIncome: 40_996_000, parkingSurplus: 18_406_000, feesCharges: 241_847_000, totalDebt: 856_823_000 }),
  withSlugAndRevenue('Enfield', 'London', 'London Borough', { incidents: 9218, fpns: 4712, rate: 51.12 }, { expenditure: 679_725_000, councilTax: 164_118_000, parkingIncome: 7_921_000, parkingSurplus: 3_017_000, feesCharges: 138_692_000, totalDebt: 1_302_065_000 }),
  withSlugAndRevenue('Hackney', 'London', 'London Borough', { incidents: 31042, fpns: 106, rate: 0.34 }, { expenditure: 780_108_000, councilTax: 109_337_928, parkingIncome: 32_858_000, parkingSurplus: 15_325_000, pcnIncome: 12_118_000, businessRates: 169_467_000, govGrants: 457_128_000, feesCharges: 140_969_000, totalDebt: 310_502_000 }),
  withSlugAndRevenue('Hammersmith and Fulham', 'London', 'London Borough', { incidents: 8087, fpns: 2164, rate: 26.76 }),
  withSlugAndRevenue('Hounslow', 'London', 'London Borough', { incidents: 25177, fpns: 4, rate: 0.02 }, { expenditure: 600_834_000, councilTax: 137_830_000, parkingIncome: 18_540_000, parkingSurplus: 10_353_000, feesCharges: 83_679_000, totalDebt: 594_504_000 }),
  withSlugAndRevenue('Islington', 'London', 'London Borough', { incidents: 3330, fpns: 772, rate: 23.18 }, { expenditure: 602_928_000, councilTax: 118_221_000, parkingIncome: 61_183_000, parkingSurplus: 35_379_000, feesCharges: 126_970_000, totalDebt: 443_390_000 }),
  withSlugAndRevenue('Lambeth', 'London', 'London Borough', { incidents: 21220, fpns: 925, rate: 4.36 }, { expenditure: 848_703_000, councilTax: 159_592_000, parkingIncome: 63_327_000, parkingSurplus: 39_214_000, feesCharges: 184_305_000, totalDebt: 1_086_896_000 }),
  withSlugAndRevenue('Lewisham', 'London', 'London Borough', { incidents: 33471, fpns: 748, rate: 2.23 }, { expenditure: 776_655_000, councilTax: 141_641_000, parkingIncome: 19_619_000, parkingSurplus: 9_393_000, feesCharges: 114_607_000, totalDebt: 207_904_000 }),
  withSlugAndRevenue('Newham', 'London', 'London Borough', { incidents: 26502, fpns: 14502, rate: 54.72 }, { expenditure: 813_213_000, councilTax: 110_300_000, parkingIncome: 39_985_000, parkingSurplus: 25_941_000, feesCharges: 102_920_000, totalDebt: 1_493_792_000 }),
  withSlugAndRevenue('Southwark', 'London', 'London Borough', { incidents: 18530, fpns: 555, rate: 3.00 }, { expenditure: 759_931_000, councilTax: 148_236_000, parkingIncome: 37_842_000, parkingSurplus: 21_939_000, feesCharges: 88_158_000, totalDebt: 1_204_258_000 }),
  withSlugAndRevenue('Tower Hamlets', 'London', 'London Borough', { incidents: 6029, fpns: 426, rate: 7.07 }, { expenditure: 907_442_000, councilTax: 138_168_000, parkingIncome: 34_960_000, parkingSurplus: 16_071_000, feesCharges: 95_926_000, totalDebt: 68_709_000 }),
  withSlugAndRevenue('Wandsworth', 'London', 'London Borough', { incidents: 5580, fpns: 1828, rate: 32.76 }, { expenditure: 561_056_000, councilTax: 71_379_000, parkingIncome: 42_899_000, parkingSurplus: 32_313_000, feesCharges: 159_436_000, totalDebt: 300_000 }),
  withSlugAndRevenue('Westminster', 'London', 'London Borough', { incidents: 20047, fpns: 2522, rate: 12.58 }, { expenditure: 518_357_000, councilTax: 69_145_000, parkingIncome: 129_416_000, parkingSurplus: 90_624_000, feesCharges: 286_004_000, totalDebt: 566_766_000 }),
  withSlugAndRevenue('Brent', 'London', 'London Borough', { incidents: 16338, fpns: 3655, rate: 22.37 }, { expenditure: 707_264_000, councilTax: 162_062_000, parkingIncome: 32_229_000, parkingSurplus: 18_638_000, feesCharges: 153_732_000, totalDebt: 1_003_146_000 }),
  withSlugAndRevenue('Waltham Forest', 'London', 'London Borough', { incidents: 10246, fpns: 2755, rate: 26.89 }, { expenditure: 607_899_000, councilTax: 138_436_000, parkingIncome: 27_276_000, parkingSurplus: 12_903_000, feesCharges: 104_842_000, totalDebt: 508_169_000 }),
  withSlugAndRevenue('Kensington and Chelsea', 'London', 'London Borough', { incidents: 7613, fpns: 2163, rate: 28.41 }, { expenditure: 367_085_000, councilTax: 104_657_000, parkingIncome: 63_167_000, parkingSurplus: 49_676_000, feesCharges: 185_510_000, totalDebt: 520_091_000 }),

  // Metropolitan
  withSlugAndRevenue('Birmingham', 'West Midlands', 'Metropolitan', { incidents: 24664, fpns: 153, rate: 0.62 }, { councilTax: 482_348_571, totalDebt: 3_393_112_000 }), // other finance data suppressed — Section 114
  withSlugAndRevenue('Leeds', 'Yorkshire', 'Metropolitan', { incidents: 13923, fpns: 83, rate: 0.60 }, { expenditure: 1_700_063_000, councilTax: 421_490_714, parkingIncome: 13_102_000, parkingSurplus: 7_524_000, pcnIncome: 8_638_000, businessRates: 234_446_000, govGrants: 1_003_475_000, feesCharges: 156_299_000, totalDebt: 2_631_478_000 }),
  withSlugAndRevenue('Manchester', 'North West', 'Metropolitan', { incidents: 14963, fpns: 992, rate: 6.63 }, { expenditure: 1_327_674_000, councilTax: 229_259_492, parkingIncome: 39_764_000, parkingSurplus: 19_480_000, pcnIncome: 14_750_000, businessRates: 435_631_000, govGrants: 629_145_000, feesCharges: 198_300_000, totalDebt: 1_709_848_000 }),
  withSlugAndRevenue('Liverpool', 'North West', 'Metropolitan', { incidents: 20300, fpns: 0, rate: 0.00 }, { expenditure: 1_345_120_000, councilTax: 235_103_456, parkingIncome: 16_111_000, parkingSurplus: 5_450_000, pcnIncome: 4_480_000, businessRates: 357_806_000, govGrants: 713_720_000, feesCharges: 124_659_000, totalDebt: 924_996_000 }),
  withSlugAndRevenue('Sheffield', 'Yorkshire', 'Metropolitan', { incidents: 12237, fpns: 129, rate: 1.05 }, { expenditure: 1_164_879_000, councilTax: 284_713_441, parkingIncome: 9_728_000, parkingSurplus: 4_899_000, pcnIncome: 1_648_000, businessRates: 208_412_000, govGrants: 659_524_000, feesCharges: 145_179_000, totalDebt: 746_549_000 }),
  withSlugAndRevenue('Bradford', 'Yorkshire', 'Metropolitan', { incidents: 19697, fpns: 91, rate: 0.46 }, { expenditure: 1_109_011_000, councilTax: 250_164_000, parkingIncome: 7_456_000, parkingSurplus: 3_349_000, feesCharges: 119_493_000, totalDebt: 707_713_000 }),
  withSlugAndRevenue('Coventry', 'West Midlands', 'Metropolitan', { incidents: 7188, fpns: 199, rate: 2.77 }, { expenditure: 686_129_000, councilTax: 175_897_581, parkingIncome: 8_909_000, parkingSurplus: 3_162_000, pcnIncome: 0, businessRates: 132_882_000, govGrants: 374_970_000, feesCharges: 101_100_000, totalDebt: 227_070_000 }),
  withSlugAndRevenue('Newcastle upon Tyne', 'North East', 'Metropolitan', { incidents: 16731, fpns: 157, rate: 0.94 }, { expenditure: 599_512_000, councilTax: 140_584_999, parkingIncome: 25_166_000, parkingSurplus: 11_408_000, pcnIncome: 3_096_000, businessRates: 113_412_000, govGrants: 330_590_000, feesCharges: 129_937_000, totalDebt: 614_842_000 }),
  withSlugAndRevenue('Sunderland', 'North East', 'Metropolitan', { incidents: 9481, fpns: 95, rate: 1.00 }, { expenditure: 551_071_000, councilTax: 128_086_782, parkingIncome: 4_136_000, parkingSurplus: 545_000, pcnIncome: 979_000, businessRates: 119_018_000, govGrants: 303_372_000, feesCharges: 84_289_000, totalDebt: 555_251_000 }),
  withSlugAndRevenue('Wirral', 'North West', 'Metropolitan', { incidents: 7977, fpns: 0, rate: 0.00 }, { expenditure: 719_447_000, councilTax: 181_258_000, parkingIncome: 2_294_000, parkingSurplus: 787_000, feesCharges: 102_147_000, totalDebt: 406_953_000 }),
  withSlugAndRevenue('Sandwell', 'West Midlands', 'Metropolitan', { incidents: 12542, fpns: 28, rate: 0.22 }, { expenditure: 687_528_000, councilTax: 135_870_000, parkingIncome: 2_570_000, parkingSurplus: 776_000, feesCharges: 64_560_000, totalDebt: 399_622_000 }),

  // Unitary
  withSlugAndRevenue('Bristol', 'South West', 'Unitary', { incidents: 10266, fpns: 217, rate: 2.11 }, { expenditure: 881_082_000, councilTax: 282_398_335, parkingIncome: 23_162_000, parkingSurplus: 12_446_000, pcnIncome: 3_567_000, businessRates: 186_494_000, govGrants: 415_887_000, feesCharges: 248_844_000, totalDebt: 642_101_000 }),
  withSlugAndRevenue('Brighton and Hove', 'South East', 'Unitary', { incidents: 1627, fpns: 390, rate: 23.97 }, { expenditure: 621_633_000, councilTax: 185_147_980, parkingIncome: 50_950_000, parkingSurplus: 33_231_000, pcnIncome: 14_349_000, businessRates: 83_789_000, govGrants: 356_651_000, feesCharges: 137_677_000, totalDebt: 471_526_000 }),
  withSlugAndRevenue('Milton Keynes', 'South East', 'Unitary', { incidents: 4258, fpns: 115, rate: 2.70 }, { expenditure: 530_040_000, councilTax: 175_118_000, parkingIncome: 13_014_000, parkingSurplus: 9_876_000, feesCharges: 61_924_000, totalDebt: 377_274_000 }),
  withSlugAndRevenue('Reading', 'South East', 'Unitary', { incidents: 2229, fpns: 221, rate: 9.91 }, { expenditure: 343_990_000, councilTax: 118_884_447, parkingIncome: 9_293_000, parkingSurplus: 4_255_000, pcnIncome: 1_708_000, businessRates: 46_747_000, govGrants: 167_743_000, feesCharges: 46_743_000, totalDebt: 529_500_000 }),
  withSlugAndRevenue('Plymouth', 'South West', 'Unitary', { incidents: 5370, fpns: 281, rate: 5.23 }, { expenditure: 467_256_000, councilTax: 138_767_778, parkingIncome: 11_519_000, parkingSurplus: 3_970_000, pcnIncome: 1_833_000, businessRates: 84_471_000, govGrants: 222_809_000, feesCharges: 71_137_000, totalDebt: 757_241_000 }),
  withSlugAndRevenue('Derby', 'East Midlands', 'Unitary', { incidents: 6477, fpns: 182, rate: 2.81 }, { expenditure: 482_142_000, councilTax: 124_961_350, parkingIncome: 8_346_000, parkingSurplus: 3_122_000, pcnIncome: 1_714_000, businessRates: 87_496_000, govGrants: 273_084_000, feesCharges: 71_211_000, totalDebt: 674_579_000 }),
  withSlugAndRevenue('Leicester', 'East Midlands', 'Unitary', { incidents: 6966, fpns: 230, rate: 3.30 }, { expenditure: 768_088_000, councilTax: 153_587_399, parkingIncome: 9_911_000, parkingSurplus: 3_792_000, pcnIncome: 4_808_000, businessRates: 147_704_000, govGrants: 461_686_000, feesCharges: 92_710_000, totalDebt: 214_490_000 }),
  withSlugAndRevenue('Nottingham', 'East Midlands', 'Unitary', { incidents: 26138, fpns: 973, rate: 3.72 }, { expenditure: 703_846_000, councilTax: 148_879_420, parkingIncome: 28_391_000, parkingSurplus: 19_966_000, pcnIncome: 3_253_000, businessRates: 131_761_000, govGrants: 456_048_000, feesCharges: 139_679_000, totalDebt: 437_771_000 }),
  withSlugAndRevenue('Peterborough', 'East', 'Unitary', { incidents: 10474, fpns: 247, rate: 2.36 }, { expenditure: 408_385_000, councilTax: 104_266_000, parkingIncome: 4_580_000, parkingSurplus: 2_347_000, feesCharges: 44_613_000, totalDebt: 478_876_000 }),
  withSlugAndRevenue('Stoke-on-Trent', 'West Midlands', 'Unitary', { incidents: 5893, fpns: 2109, rate: 35.79 }, { expenditure: 509_036_000, councilTax: 111_063_000, parkingIncome: 5_003_000, parkingSurplus: -120_000, feesCharges: 94_444_000, totalDebt: 795_029_000 }),
  withSlugAndRevenue('Luton', 'East', 'Unitary', { incidents: 11599, fpns: 144, rate: 1.24 }, { expenditure: 443_306_000, councilTax: 103_014_000, parkingIncome: 4_245_000, parkingSurplus: 1_195_000, feesCharges: 42_233_000, totalDebt: 741_858_000 }),
  withSlugAndRevenue('Southampton', 'South East', 'Unitary', { incidents: 12208, fpns: 38, rate: 0.31 }, { expenditure: 512_747_000, councilTax: 121_430_000, parkingIncome: 13_230_000, parkingSurplus: 5_908_000, feesCharges: 64_955_000, totalDebt: 348_797_000 }),
  withSlugAndRevenue('Thurrock', 'East', 'Unitary', { incidents: 3037, fpns: 1112, rate: 36.62 }, { expenditure: 235_472_000, councilTax: 91_267_000, parkingIncome: 2_063_000, parkingSurplus: 577_000, feesCharges: 55_447_000, totalDebt: 831_318_000 }),

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
  withSlugAndRevenue('Breckland', 'East', 'District', { incidents: 830, fpns: 24, rate: 2.89 }, { expenditure: 27_007_000, councilTax: 10_833_000, feesCharges: 6_109_000 }),
  withSlugAndRevenue('Cherwell', 'South East', 'District', { incidents: 1332, fpns: 29, rate: 2.18 }, { expenditure: 37_322_000, councilTax: 15_416_000, feesCharges: 9_377_000, totalDebt: 149_000_000 }),
  withSlugAndRevenue('Pendle', 'North West', 'District', { incidents: 6186, fpns: 81, rate: 1.31 }, { expenditure: 24_204_000, councilTax: 10_323_000, feesCharges: 4_129_000, totalDebt: 18_359_000 }),
  withSlugAndRevenue('South Cambridgeshire', 'East', 'District', { incidents: 943, fpns: 47, rate: 4.98 }, { expenditure: 32_949_000, councilTax: 19_244_000, feesCharges: 14_947_000, totalDebt: 317_123_000 }),
  withSlugAndRevenue('Waverley', 'South East', 'District', { incidents: 715, fpns: 1, rate: 0.14 }, { expenditure: 22_078_000, councilTax: 16_834_000, parkingIncome: 6_385_000, parkingSurplus: 4_275_000, feesCharges: 13_966_000, totalDebt: 130_506_000 }),
  withSlugAndRevenue('New Forest', 'South East', 'District', { incidents: 1361, fpns: 852, rate: 62.60 }, { expenditure: 37_235_000, councilTax: 22_848_000, parkingIncome: 4_712_000, parkingSurplus: 2_669_000, feesCharges: 14_056_000, totalDebt: 129_904_000 }),
  withSlugAndRevenue('Boston', 'East Midlands', 'District', { incidents: 4687, fpns: 67, rate: 1.43 }, { expenditure: 12_330_000, councilTax: 5_735_000, parkingIncome: 946_000, parkingSurplus: 469_000, feesCharges: 4_076_000, totalDebt: 1_000_000 }),
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
