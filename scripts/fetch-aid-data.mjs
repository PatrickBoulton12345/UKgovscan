#!/usr/bin/env node
/**
 * Build-time data fetcher for the foreign-aid page.
 *
 * Pulls pre-aggregated UK foreign aid statistics from the ukgovscan.com API
 * (which itself ingests the IATI Datastore for FCDO and OECD CRS for ODA totals)
 * and writes them to lib/aid-data.json for the page to render at build time.
 *
 * If either upstream call fails, exits 0 and leaves the existing JSON in place
 * so a deploy never breaks because of a transient upstream outage.
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '..', 'lib', 'aid-data.json')

const HEADERS = {
  'User-Agent':
    'UKgovscan-vercel build script (https://github.com/PatrickBoulton12345/UKgovscan)',
  Accept: 'application/json',
  Referer: 'https://ukgovscan.com/foreign-aid',
}

async function getJSON(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.json()
}

// Pick the most recent calendar year that has meaningful IATI reporting
// (project count above the threshold). Prevents us from showing the current
// half-empty year if it's just a few weeks old.
const MIN_PROJECTS_FOR_CURRENT_YEAR = 500

async function pickCurrentYear() {
  const now = new Date()
  const candidates = [now.getUTCFullYear(), now.getUTCFullYear() - 1, now.getUTCFullYear() - 2]
  for (const y of candidates) {
    const data = await getJSON(`https://ukgovscan.com/api/foreign-aid?year=${y}&limit=1`)
    const projectCount = data?.summary?.projectCount ?? 0
    console.log(`[aid-data]   year ${y}: ${projectCount} projects`)
    if (projectCount >= MIN_PROJECTS_FOR_CURRENT_YEAR) {
      return { year: y, data }
    }
  }
  throw new Error('No recent year has enough reporting to use as "current"')
}

async function main() {
  console.log('[aid-data] Fetching IATI aggregation from ukgovscan.com…')
  const iati = await getJSON('https://ukgovscan.com/api/foreign-aid')
  console.log('[aid-data] Fetching OECD CRS aggregation from ukgovscan.com…')
  const oecd = await getJSON('https://ukgovscan.com/api/foreign-aid/oecd')
  console.log('[aid-data] Picking most recent year with substantial reporting…')
  const { year: currentYear, data: currentYearData } = await pickCurrentYear()
  console.log(`[aid-data] Using ${currentYear} as "current year"`)

  const countriesAll = iati?.filters?.countries ?? []
  const sectorsAll = iati?.filters?.sectors ?? []
  const summary = iati?.summary ?? {}

  // Build a code → currentYear spend lookup
  const currentYearByCode = new Map()
  for (const c of currentYearData?.filters?.countries ?? []) {
    currentYearByCode.set(c.code, {
      budget: Math.round(c.totalBudget ?? 0),
      projects: c.projectCount ?? 0,
    })
  }

  const countries = [...countriesAll]
    .sort((a, b) => (b.totalBudget ?? 0) - (a.totalBudget ?? 0))
    .slice(0, 25)
    .map((c) => {
      const cy = currentYearByCode.get(c.code)
      return {
        code: c.code,
        name: c.name,
        budget: Math.round(c.totalBudget ?? 0),
        projects: c.projectCount ?? 0,
        currentYearBudget: cy?.budget ?? 0,
        currentYearProjects: cy?.projects ?? 0,
      }
    })

  const sectors = [...sectorsAll]
    .sort((a, b) => (b.totalBudget ?? 0) - (a.totalBudget ?? 0))
    .slice(0, 10)
    .map((s) => ({
      name: s.name,
      budget: Math.round(s.totalBudget ?? 0),
      projects: s.projectCount ?? 0,
    }))

  const out = {
    generatedAt: new Date().toISOString(),
    sources: [
      {
        label: 'IATI (FCDO publications)',
        url: 'https://datastore.codeforiati.org',
      },
      {
        label: 'OECD Creditor Reporting System (UK ODA)',
        url: 'https://stats.oecd.org/Index.aspx?DataSetCode=crs1',
      },
      {
        label: 'FCDO DevTracker (project-level detail)',
        url: 'https://devtracker.fcdo.gov.uk',
      },
    ],
    iatiSummary: {
      totalBudgetGbp: Math.round(summary.totalSpent ?? 0),
      projectCount: summary.projectCount ?? 0,
      countryCount: summary.countryCount ?? 0,
      sectorCount: summary.sectorCount ?? 0,
    },
    currentYear: {
      year: currentYear,
      totalSpentGbp: Math.round(currentYearData?.summary?.totalSpent ?? 0),
      projectCount: currentYearData?.summary?.projectCount ?? 0,
      countryCount: currentYearData?.summary?.countryCount ?? 0,
    },
    oecd: {
      latestYear: oecd?.selectedYear ?? null,
      latestDisbursementGbp: oecd?.summary?.totalDisbursementGbp ?? null,
      latestProjectCount: oecd?.summary?.projectCount ?? null,
      byYear: (oecd?.byYear ?? []).map((y) => ({
        year: y.year,
        disbursementGbp: y.disbursementGbp,
        projectCount: y.projectCount,
      })),
    },
    topCountries: countries,
    topSectors: sectors,
  }

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(`[aid-data] Wrote ${OUT_PATH}`)
  console.log(`[aid-data] Top 10 recipient countries:`)
  console.log(`[aid-data]   ${'country'.padEnd(40)} ${'cumulative'.padStart(15)}    ${`${currentYear} spend`.padStart(15)}`)
  for (const c of countries.slice(0, 10)) {
    console.log(
      `[aid-data]   ${c.name.padEnd(40)} £${c.budget.toLocaleString().padStart(14)}    £${c.currentYearBudget.toLocaleString().padStart(13)}`
    )
  }
  console.log(
    `[aid-data] OECD latest (${out.oecd.latestYear}): £${(out.oecd.latestDisbursementGbp ?? 0).toLocaleString()} across ${out.oecd.latestProjectCount} projects`
  )
}

main().catch((err) => {
  console.error('[aid-data] ERROR:', err.message)
  if (existsSync(OUT_PATH)) {
    console.warn(
      '[aid-data] Keeping existing data file; build will continue with stale data.'
    )
    process.exit(0)
  } else {
    console.error('[aid-data] No existing data file. Failing build.')
    process.exit(1)
  }
})
