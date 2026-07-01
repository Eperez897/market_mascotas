import { Check } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
}

const styles: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-stone-800 text-white',
}

export function Toast({ message, type = 'info' }: ToastProps) {
  if (!message) return null
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2 transition-all ${styles[type] ?? styles.info}`}
    >
      <Check size={14} />
      {message}
    </div>
  )
}
