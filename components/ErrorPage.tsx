import Link from 'next/link'

export default function ErrorPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mt-20 text-center space-y-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {description && <p>{description}</p>}
      <Link href="/" className="text-blue-600 underline">
        ホームに戻る
      </Link>
    </div>
  )
}
