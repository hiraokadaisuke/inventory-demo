'use client'
import React from 'react'

export default function ErrorPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-8 text-center">
      <h1 className="text-2xl font-bold" data-testid="error-title">{title}</h1>
      <p className="mt-2" data-testid="error-description">{description}</p>
    </div>
  )
}
