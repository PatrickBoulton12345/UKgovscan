import type { CompanyProfile, CompanySearchResponse } from '@/lib/types'

const BASE_URL = 'https://api.company-information.service.gov.uk'

function getAuthHeader(): string {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Companies House API key not configured')
  }
  return 'Basic ' + Buffer.from(apiKey + ':').toString('base64')
}

export async function searchCompanies(
  query: string,
  page: number = 1
): Promise<CompanySearchResponse> {
  const res = await fetch(
    `${BASE_URL}/search/companies?q=${encodeURIComponent(query)}&items_per_page=20&start_index=${(page - 1) * 20}`,
    {
      headers: { Authorization: getAuthHeader() },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    throw new Error(`Companies House API error: ${res.status}`)
  }

  return res.json()
}

export async function getCompany(
  companyNumber: string
): Promise<CompanyProfile | null> {
  const res = await fetch(
    `${BASE_URL}/company/${encodeURIComponent(companyNumber)}`,
    {
      headers: { Authorization: getAuthHeader() },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return null
  return res.json()
}

export async function getCompanyOfficers(companyNumber: string) {
  const res = await fetch(
    `${BASE_URL}/company/${encodeURIComponent(companyNumber)}/officers`,
    {
      headers: { Authorization: getAuthHeader() },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return null
  return res.json()
}
