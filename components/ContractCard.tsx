import type { ContractRelease } from '@/lib/types'
import { formatCurrency, formatDate, truncate, getContractStatusColour } from '@/lib/utils'

interface ContractCardProps {
  contract: ContractRelease
}

export default function ContractCard({ contract }: ContractCardProps) {
  const value =
    contract.awards?.[0]?.value?.amount ??
    contract.tender?.value?.amount

  const status = contract.tender?.status || 'unknown'
  const supplier = contract.awards?.[0]?.suppliers?.[0]?.name
  const awardDate = contract.awards?.[0]?.date

  return (
    <div className="stat-card group cursor-pointer">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-dm font-bold text-sm leading-tight flex-1">
          {truncate(contract.tender?.title || 'Untitled', 120)}
        </h3>
        <span
          className={`shrink-0 px-2 py-0.5 text-xs font-dm font-bold rounded ${getContractStatusColour(status)}`}
        >
          {status}
        </span>
      </div>

      <p className="text-xs text-gray-500 font-dm mb-3 line-clamp-2">
        {truncate(contract.tender?.description || '', 200)}
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-dm">
        <div>
          <span className="text-gray-400">Buyer: </span>
          <span className="font-bold">{contract.buyer?.name || '—'}</span>
        </div>
        {supplier && (
          <div>
            <span className="text-gray-400">Supplier: </span>
            <span className="font-bold">{supplier}</span>
          </div>
        )}
        {value && (
          <div>
            <span className="text-gray-400">Value: </span>
            <span className="font-bold text-lfg-orange">
              {formatCurrency(value)}
            </span>
          </div>
        )}
        <div>
          <span className="text-gray-400">Published: </span>
          <span>{formatDate(awardDate || contract.publishedDate)}</span>
        </div>
      </div>
    </div>
  )
}
