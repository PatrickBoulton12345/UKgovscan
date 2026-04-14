// Contracts Finder OCDS types
export interface ContractRelease {
  id: string
  ocid: string
  tag: string[]
  initiationType: string
  publishedDate: string
  tender: {
    id: string
    title: string
    description: string
    status: string
    value?: { amount: number; currency: string }
    procurementMethod?: string
    numberOfTenderers?: number
    tenderPeriod?: { startDate: string; endDate: string }
  }
  buyer: {
    id: string
    name: string
    address?: {
      locality?: string
      region?: string
      countryName?: string
    }
  }
  awards?: Array<{
    id: string
    title: string
    status: string
    date: string
    value?: { amount: number; currency: string }
    suppliers?: Array<{
      id: string
      name: string
      address?: {
        locality?: string
        region?: string
      }
    }>
  }>
}

export interface ContractSearchResponse {
  releases: ContractRelease[]
  total: number
  page: number
  pageSize: number
}

// Companies House types
export interface CompanyProfile {
  company_number: string
  company_name: string
  company_status: string
  type: string
  date_of_creation: string
  registered_office_address: {
    address_line_1?: string
    address_line_2?: string
    locality?: string
    region?: string
    postal_code?: string
    country?: string
  }
  sic_codes?: string[]
  accounts?: {
    last_accounts?: {
      made_up_to: string
      type: string
    }
  }
}

export interface CompanySearchResult {
  company_number: string
  title: string
  company_status: string
  address_snippet: string
  date_of_creation: string
  company_type: string
}

export interface CompanySearchResponse {
  items: CompanySearchResult[]
  total_results: number
  page_number: number
  items_per_page: number
}

// Spending types
export interface SpendingRecord {
  department: string
  entity: string
  date: string
  supplier: string
  amount: number
  description: string
  transactionNumber?: string
}

// School types
export interface School {
  urn: string
  name: string
  type: string
  phase: string
  localAuthority: string
  ofstedRating?: string
  lastInspection?: string
  pupils?: number
  funding?: number
}

// Council types
export interface Council {
  name: string
  code: string
  region: string
  type: string
  population?: number
  totalSpend?: number
  contractCount?: number
  totalContractValue?: number
}

// Search types
export interface SearchResult {
  type: 'contract' | 'company' | 'council' | 'school'
  title: string
  subtitle: string
  value?: number
  url: string
  meta?: Record<string, string>
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number
  name: string
  code?: string
  totalValue: number
  contractCount: number
  region?: string
  change?: number
}
