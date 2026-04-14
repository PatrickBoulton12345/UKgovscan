export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `£${(amount / 1_000_000_000).toFixed(1)}bn`
  }
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}m`
  }
  if (amount >= 1_000) {
    return `£${(amount / 1_000).toFixed(0)}k`
  }
  return `£${amount.toLocaleString('en-GB')}`
}

export function formatCurrencyFull(amount: number): string {
  return `£${amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-GB')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function contractsFinderUrl(ocid: string): string {
  // OCID format: ocds-b5fd17-{uuid} → notice URL uses the UUID
  const uuid = ocid.replace(/^ocds-b5fd17-/, '')
  return `https://www.contractsfinder.service.gov.uk/Notice/${uuid}`
}

export function getContractStatusColour(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    case 'awarded':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
