import ErrorPage from '@/components/ErrorPage'

export const metadata = {
  title: 'サーバーエラー',
}

export default function Custom500Page() {
  return <ErrorPage title="サーバーエラー" description="サーバーエラーが発生しました" />
}
