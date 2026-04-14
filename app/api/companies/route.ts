import { NextRequest, NextResponse } from 'next/server'
import { searchCompanies, getCompany } from '@/lib/api/companies-house'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('q')
  const companyNumber = searchParams.get('number')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    if (companyNumber) {
      const company = await getCompany(companyNumber)
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(company)
    }

    if (query) {
      const results = await searchCompanies(query, page)
      return NextResponse.json(results)
    }

    return NextResponse.json(
      { error: 'Provide q or number parameter' },
      { status: 400 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch company data'
    const status = message.includes('not configured') ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
