export const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Добавить пользователя</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">Экспорт данных</button>
      </div>
    </div>
  );
};
