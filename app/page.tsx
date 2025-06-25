'use client'

import Hero from '@/components/lp/Hero'
import Features from '@/components/lp/Features'
import Benefits from '@/components/lp/Benefits'
import Functions from '@/components/lp/Functions'
import Logos from '@/components/lp/Logos'
import Testimonials from '@/components/lp/Testimonials'
import FAQ from '@/components/lp/FAQ'
import CTA from '@/components/lp/CTA'
import Footer from '@/components/lp/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Benefits />
      <Functions />
      <Logos />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
