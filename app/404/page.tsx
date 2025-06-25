import ErrorPage from '@/components/ErrorPage'

export const metadata = {
  title: 'ページが見つかりません',
}

export default function NotFoundPage() {
  return (
    <ErrorPage title="ページが見つかりません" description="お探しのページは存在しません。" />
  )
}
