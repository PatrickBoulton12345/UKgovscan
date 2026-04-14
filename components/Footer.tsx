import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-lfg-black text-white mt-auto">
      <div className="brand-motif" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-octarine text-lfg-orange text-xl lowercase">lfg</span>
              <span className="font-octarine text-white text-xl lowercase">govscan</span>
            </div>
            <p className="text-gray-400 text-sm font-dm leading-relaxed">
              Making it easier for the public to explore how public money is
              spent. Built with open government data.
            </p>
          </div>

          <div>
            <h4 className="font-dm font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/contracts" className="text-gray-300 hover:text-white text-sm font-dm">
                Contracts
              </Link>
              <Link href="/spending" className="text-gray-300 hover:text-white text-sm font-dm">
                Spending
              </Link>
              <Link href="/councils" className="text-gray-300 hover:text-white text-sm font-dm">
                Councils
              </Link>
              <Link href="/schools" className="text-gray-300 hover:text-white text-sm font-dm">
                Schools
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-dm font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Info
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-gray-300 hover:text-white text-sm font-dm">
                About
              </Link>
              <a
                href="https://lookingforgrowth.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-sm font-dm"
              >
                lookingforgrowth.uk
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-dm">
            Data sourced under the Open Government Licence v3.0 and Open Parliament Licence.
          </p>
          <p className="text-gray-500 text-xs font-dm">
            An independent project by{' '}
            <a href="https://lookingforgrowth.uk" target="_blank" rel="noopener noreferrer" className="text-lfg-orange hover:underline">
              looking for growth
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
