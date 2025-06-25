'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-100 text-gray-600 text-center text-sm">
      <p className="mb-2">&copy; 2024 パチ番頭</p>
      <p>
        <Link href="/privacy" className="underline">
          プライバシーポリシー
        </Link>
      </p>
    </footer>
  )
}
