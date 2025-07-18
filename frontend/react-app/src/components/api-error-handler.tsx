"use client"

import { useEffect } from 'react' // Добавили импорт useEffect
import { useRouter } from 'next/navigation'

export function ApiErrorHandler({ error }: { error: Error }) {
  const router = useRouter()

  useEffect(() => {
    if (error.message.includes('401')) {
      router.push('/login')
    }
  }, [error, router])

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Ошибка:</strong> {error.message}
    </div>
  )
}
