"use client";
import Link from 'next/link'
export default function Logo() {
  return (
    <Link href="/admin/inventory" className="font-bold text-lg text-[#191970]">
      パチ在庫
    </Link>
  );
}
