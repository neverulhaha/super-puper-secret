export default function Confirmed() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-medium mb-4">Email подтверждён</h1>
        <p className="mb-6">Теперь вы можете войти в свой аккаунт</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Войти
        </a>
      </div>
    </div>
  );
}
