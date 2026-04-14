import { NextRequest, NextResponse } from 'next/server'

interface IATIBudget {
  value?: { text?: string | number }
}

interface IATICountry {
  code?: string
  narrative?: string
  percentage?: string
}

interface IATIActivity {
  'iati-activity': {
    title?: { narrative?: string }
    description?: { narrative?: string; type?: string }
    'recipient-country'?: IATICountry | IATICountry[]
    budget?: IATIBudget | IATIBudget[]
    'activity-status'?: { code?: string }
    'activity-date'?: Array<{ type?: string; 'iso-date'?: string }>
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')
  const limit = parseInt(searchParams.get('limit') || '100')

  try {
    let url = `https://datastore.codeforiati.org/api/1/access/activity.json?reporting-org=GB-GOV-1&limit=${limit}&stream=False`
    if (country) {
      url += `&recipient-country=${encodeURIComponent(country)}`
    }

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      throw new Error(`IATI API error: ${res.status}`)
    }

    const data = await res.json()
    const activities: IATIActivity[] = data['iati-activities'] || []

    const results = activities.map((a) => {
      const act = a['iati-activity']
      const title = act.title?.narrative || 'Untitled'
      const desc = act.description?.narrative || ''

      // Country
      const rc = act['recipient-country']
      let countryName = '—'
      let countryCode = ''
      if (Array.isArray(rc) && rc.length > 0) {
        countryName = rc[0].narrative || '—'
        countryCode = rc[0].code || ''
      } else if (rc && typeof rc === 'object') {
        countryName = (rc as IATICountry).narrative || '—'
        countryCode = (rc as IATICountry).code || ''
      }

      // Budget total
      const budget = act.budget
      let total = 0
      if (Array.isArray(budget)) {
        total = budget.reduce(
          (sum, b) => sum + (parseFloat(String(b.value?.text || 0)) || 0),
          0
        )
      } else if (budget && typeof budget === 'object') {
        total = parseFloat(String((budget as IATIBudget).value?.text || 0)) || 0
      }

      return {
        title,
        description: desc.slice(0, 300),
        country: countryName,
        countryCode,
        budget: total,
      }
    })

    return NextResponse.json({ results, total: results.length })
  } catch (error) {
    console.error('Aid API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aid data' },
      { status: 500 }
    )
  }
}
