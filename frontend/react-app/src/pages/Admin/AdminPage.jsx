import { AdminSidebar, UserManagement, SystemStats, QuickActions } from '../../components/Admin';

export const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Административная панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SystemStats />
          <QuickActions />
        </div>
        
        <UserManagement />
      </div>
    </div>
  );
};
