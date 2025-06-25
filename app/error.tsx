'use client'

import ErrorPage from '@/components/ErrorPage'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-8 text-center space-y-4">
      <ErrorPage title="エラーが発生しました" description={error.message} />
      <Button onClick={reset}>再試行</Button>
    </div>
  )
}
