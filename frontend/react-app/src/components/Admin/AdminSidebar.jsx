export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 p-4">
      <h2 className="text-xl font-bold text-white mb-6">Админ-панель</h2>
      <nav className="space-y-2">
        <a href="#" className="block px-4 py-2 text-white bg-gray-700 rounded">Пользователи</a>
        <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white">Настройки</a>
        <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white">Логи</a>
      </nav>
    </div>
  );
};
