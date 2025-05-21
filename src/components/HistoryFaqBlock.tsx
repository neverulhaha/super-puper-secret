'use client'
import { useState } from 'react'
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const DEFAULT_FAQ = [
  {
    question: 'Как добавить объект на карту?',
    answer: 'Выберите тип объекта и кликните по сфере Луны.'
  },
  {
    question: 'Как удалить объект?',
    answer: 'На данный момент удаление реализовано через сброс макета (кнопка "Сброс").'
  },
  {
    question: 'Почему важно следить за показателями безопасности?',
    answer: 'Показатели позволяют оценить, насколько ваша инфраструктура сбалансирована и безопасна для экипажа.'
  },
  {
    question: 'Можно ли сохранить макет и продолжить работу позже?',
    answer: 'Да, используйте кнопку "Сохранить макет в базу", чтобы загрузить его в следующий раз.'
  }
]

export default function HistoryFaqBlock({ history = [] }: { history: string[] }) {
  const [tab, setTab] = useState<'history' | 'faq'>('history')
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded">
      <div className="flex border-b">
        <button
          className={`flex-1 px-4 py-2 font-semibold flex items-center gap-2 ${tab === 'history' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTab('history')}
        >
          <ClockIcon className="w-5 h-5" /> История
        </button>
        <button
          className={`flex-1 px-4 py-2 font-semibold flex items-center gap-2 ${tab === 'faq' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTab('faq')}
        >
          <QuestionMarkCircleIcon className="w-5 h-5" /> FAQ
        </button>
      </div>
      <div className="p-4 min-h-[120px]">
        {tab === 'history' ? (
          history.length > 0 ? (
            <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
              {history.slice(-8).reverse().map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">Пока нет изменений.</div>
          )
        ) : (
          <div>
            {DEFAULT_FAQ.map((f, i) => (
              <details key={i} className="mb-2">
                <summary className="font-medium cursor-pointer text-blue-600">{f.question}</summary>
                <div className="text-gray-700 ml-2 text-sm">{f.answer}</div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
