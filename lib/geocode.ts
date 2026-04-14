const UK_CITIES: Record<string, [number, number]> = {
  london: [51.5074, -0.1278],
  'city of london': [51.5155, -0.0922],
  westminster: [51.4973, -0.1372],
  manchester: [53.4808, -2.2426],
  birmingham: [52.4862, -1.8904],
  leeds: [53.8008, -1.5491],
  glasgow: [55.8617, -4.2583],
  edinburgh: [55.9533, -3.1883],
  liverpool: [53.4084, -2.9916],
  bristol: [51.4545, -2.5879],
  sheffield: [53.3811, -1.4701],
  cardiff: [51.4816, -3.1791],
  belfast: [54.5973, -5.9301],
  newcastle: [54.9783, -1.6178],
  'newcastle upon tyne': [54.9783, -1.6178],
  nottingham: [52.9548, -1.1581],
  leicester: [52.6369, -1.1398],
  coventry: [52.4068, -1.5197],
  bradford: [53.7960, -1.7594],
  stoke: [53.0027, -2.1794],
  'stoke-on-trent': [53.0027, -2.1794],
  wolverhampton: [52.5868, -2.1257],
  derby: [52.9225, -1.4746],
  southampton: [50.9097, -1.4044],
  portsmouth: [50.8198, -1.0880],
  plymouth: [50.3755, -4.1427],
  reading: [51.4543, -0.9781],
  oxford: [51.7520, -1.2577],
  cambridge: [52.2053, 0.1218],
  norwich: [52.6309, 1.2974],
  ipswich: [52.0567, 1.1482],
  exeter: [50.7184, -3.5339],
  brighton: [50.8225, -0.1372],
  'brighton and hove': [50.8225, -0.1372],
  hull: [53.7676, -0.3274],
  'kingston upon hull': [53.7676, -0.3274],
  middlesbrough: [54.5742, -1.2350],
  sunderland: [54.9069, -1.3838],
  swansea: [51.6214, -3.9436],
  newport: [51.5842, -2.9977],
  aberdeen: [57.1497, -2.0943],
  dundee: [56.4620, -2.9707],
  inverness: [57.4778, -4.2247],
  york: [53.9600, -1.0873],
  peterborough: [52.5695, -0.2405],
  luton: [51.8787, -0.4200],
  milton: [52.0406, -0.7594],
  'milton keynes': [52.0406, -0.7594],
  gloucester: [51.8642, -2.2383],
  worcester: [52.1920, -2.2200],
  bath: [51.3758, -2.3599],
  hereford: [52.0567, -2.7160],
  shrewsbury: [52.7077, -2.7544],
  chester: [53.1905, -2.8928],
  carlisle: [54.8951, -2.9382],
  lincoln: [53.2307, -0.5406],
  grantham: [52.9140, -0.6385],
  telford: [52.6785, -2.4453],
  swindon: [51.5558, -1.7797],
  salisbury: [51.0693, -1.7942],
  winchester: [51.0632, -1.3080],
  guildford: [51.2362, -0.5704],
  slough: [51.5105, -0.5950],
  watford: [51.6565, -0.3903],
  hertford: [51.7947, -0.0787],
  chelmsford: [51.7356, 0.4685],
  colchester: [51.8959, 0.8919],
  southend: [51.5385, 0.7148],
  'southend-on-sea': [51.5385, 0.7148],
  medway: [51.4048, 0.5432],
  maidstone: [51.2720, 0.5291],
  tunbridge: [51.1320, 0.2630],
  'royal tunbridge wells': [51.1320, 0.2630],
  crawley: [51.1090, -0.1872],
  worthing: [50.8179, -0.3726],
  eastbourne: [50.7684, 0.2844],
  hastings: [50.8543, 0.5732],
  folkestone: [51.0820, 1.1720],
  dover: [51.1279, 1.3134],
  canterbury: [51.2802, 1.0789],
  croydon: [51.3762, -0.0982],
  kingston: [51.4085, -0.3064],
  'kingston upon thames': [51.4085, -0.3064],
  wigan: [53.5450, -2.6376],
  bolton: [53.5780, -2.4286],
  rochdale: [53.6097, -2.1556],
  salford: [53.4875, -2.2901],
  oldham: [53.5409, -2.1114],
  stockport: [53.4083, -2.1494],
  warrington: [53.3900, -2.5970],
  blackpool: [53.8175, -3.0357],
  blackburn: [53.7480, -2.4820],
  burnley: [53.7893, -2.2417],
  lancaster: [54.0466, -2.8007],
  'st helens': [53.4550, -2.7360],
  wirral: [53.3673, -3.0741],
  huddersfield: [53.6458, -1.7850],
  wakefield: [53.6830, -1.4977],
  doncaster: [53.5228, -1.1283],
  rotherham: [53.4326, -1.3635],
  barnsley: [53.5534, -1.4797],
  chesterfield: [53.2350, -1.4210],
  mansfield: [53.1476, -1.1966],
  'newark on trent': [53.0773, -0.8116],
  grimsby: [53.5676, -0.0797],
  scunthorpe: [53.5783, -0.6382],
  hartlepool: [54.6918, -1.2128],
  darlington: [54.5274, -1.5537],
  stockton: [54.5704, -1.3195],
  'stockton-on-tees': [54.5704, -1.3195],
  portsea: [50.8081, -1.0667],
  basingstoke: [51.2665, -1.0872],
  aldershot: [51.2473, -0.7560],
  fareham: [50.8518, -1.1786],
  gosport: [50.7940, -1.1220],
  poole: [50.7150, -1.9870],
  bournemouth: [50.7209, -1.8795],
  christchurch: [50.7337, -1.7837],
  weymouth: [50.6145, -2.4590],
  torquay: [50.4655, -3.5251],
  paignton: [50.4352, -3.5640],
  'newton abbot': [50.5283, -3.6120],
  taunton: [51.0150, -3.1016],
  yeovil: [50.9452, -2.6382],
  truro: [50.2632, -5.0510],
  'st austell': [50.3402, -4.7913],
  newquay: [50.4130, -5.0754],
  penzance: [50.1188, -5.5372],
  'weston-super-mare': [51.3461, -2.9770],
  'milton keynes unitary': [52.0406, -0.7594],
  perth: [56.3950, -3.4313],
  stirling: [56.1165, -3.9369],
  falkirk: [56.0019, -3.7839],
  'east kilbride': [55.7644, -4.1769],
  hamilton: [55.7770, -4.0393],
  kilmarnock: [55.6114, -4.4958],
  ayr: [55.4626, -4.6297],
  paisley: [55.8456, -4.4254],
  greenock: [55.9458, -4.7498],
  motherwell: [55.7910, -3.9899],
  wrexham: [53.0462, -2.9922],
  bangor: [53.2278, -4.1293],
  rhyl: [53.3199, -3.4896],
  aberystwyth: [52.4153, -4.0829],
  llanelli: [51.6835, -4.1625],
  londonderry: [54.9966, -7.3086],
  derry: [54.9966, -7.3086],
  lisburn: [54.5162, -6.0581],
  armagh: [54.3503, -6.6528],
  newry: [54.1754, -6.3360],
  omagh: [54.5996, -7.2968],
}

export function geocodeLocality(
  locality: string | undefined
): [number, number] | null {
  if (!locality) return null
  const normalised = locality.toLowerCase().trim()
  if (UK_CITIES[normalised]) return UK_CITIES[normalised]

  const firstWord = normalised.split(/[\s,]/)[0]
  if (firstWord && UK_CITIES[firstWord]) return UK_CITIES[firstWord]

  for (const [key, coords] of Object.entries(UK_CITIES)) {
    if (key.includes(normalised) || normalised.includes(key)) return coords
  }
  return null
}

// Suffixes to strip from buyer names to extract a place name
const BUYER_SUFFIXES = [
  'city council',
  'borough council',
  'county council',
  'district council',
  'metropolitan borough council',
  'council',
  'nhs foundation trust',
  'nhs trust',
  'nhs',
  'university hospitals',
  'university hospital',
  'clinical commissioning group',
  'combined authority',
  'fire and rescue service',
  'fire & rescue service',
  'police',
  'limited',
  'ltd',
  'plc',
]

export function geocodeBuyer(
  buyerName: string | undefined,
  locality: string | undefined
): [number, number] | null {
  // Try locality first (rarely populated but most accurate)
  const fromLocality = geocodeLocality(locality)
  if (fromLocality) return fromLocality

  if (!buyerName) return null

  let name = buyerName.toLowerCase().trim()

  // Handle "London Borough of X" pattern
  const lbMatch = name.match(/london borough of\s+(.+)/)
  if (lbMatch) return UK_CITIES['london'] ?? null

  // Handle "Royal Borough of X" pattern
  if (name.includes('royal borough')) return UK_CITIES['london'] ?? null

  // Handle "University of X" pattern
  const uniMatch = name.match(/university of\s+(.+)/)
  if (uniMatch) {
    const place = uniMatch[1].trim()
    const result = geocodeLocality(place)
    if (result) return result
  }

  // Strip known suffixes to extract the place name
  for (const suffix of BUYER_SUFFIXES) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length).trim()
      break
    }
  }

  // Remove leading "the" or "city of"
  name = name.replace(/^the\s+/, '').replace(/^city of\s+/, '')

  // Try the cleaned name
  if (UK_CITIES[name]) return UK_CITIES[name]

  // Try each word (for multi-word names like "Dorset County Hospital")
  const words = name.split(/\s+/)
  for (const word of words) {
    if (word.length > 3 && UK_CITIES[word]) return UK_CITIES[word]
  }

  // Try partial matching
  for (const [key, coords] of Object.entries(UK_CITIES)) {
    if (name.includes(key) || key.includes(name)) return coords
  }

  return null
}
