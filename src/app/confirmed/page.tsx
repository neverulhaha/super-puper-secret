export default function Confirmed() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white text-black p-6 sm:p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-xl sm:text-2xl font-medium mb-4">Email подтверждён</h1>
        <p className="text-sm sm:text-base mb-6">Теперь вы можете войти в свой аккаунт</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Войти
        </a>
      </div>
    </div>
  )
}
