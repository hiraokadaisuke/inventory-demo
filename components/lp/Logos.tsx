'use client'

export default function Logos() {
  const companies = ['GO Inc.', 'ACME', 'Vercel', 'Next.js']
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
        {companies.map((c) => (
          <div key={c} className="text-gray-500 font-semibold text-lg">
            {c}
          </div>
        ))}
      </div>
    </section>
  )
}
