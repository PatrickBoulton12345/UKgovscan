import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600

const UPSTREAM_HEADERS = {
  'User-Agent':
    'UKgovscan-vercel (https://github.com/PatrickBoulton12345/UKgovscan)',
  Accept: 'application/json',
  Referer: 'https://ukgovscan.com/foreign-aid',
}

async function fetchPage(code: string, page: number, limit: number) {
  const url = `https://ukgovscan.com/api/foreign-aid?country=${code}&page=${page}&limit=${limit}`
  const res = await fetch(url, {
    headers: UPSTREAM_HEADERS,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`upstream ${res.status} on page ${page}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase()
  if (!code || !/^[A-Z]{2}$/.test(code)) {
    return NextResponse.json({ error: 'invalid country code' }, { status: 400 })
  }

  const limit = 100
  const maxPages = 30 // safety cap → 3000 projects max

  try {
    const first = await fetchPage(code, 1, limit)
    const totalPages = Math.min(first.pagination?.totalPages ?? 1, maxPages)
    const projects = [...(first.projects ?? [])]

    if (totalPages > 1) {
      const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
      const results = await Promise.all(
        remaining.map((p) => fetchPage(code, p, limit))
      )
      for (const r of results) projects.push(...(r.projects ?? []))
    }

    return NextResponse.json({
      countryCode: code,
      countryName: projects[0]?.recipientCountryName ?? code,
      total: first.pagination?.total ?? projects.length,
      truncated: (first.pagination?.totalPages ?? 0) > maxPages,
      projects,
    })
  } catch (err) {
    console.error('[aid-country] error:', err)
    return NextResponse.json(
      { error: 'failed to fetch country data' },
      { status: 502 }
    )
  }
}
