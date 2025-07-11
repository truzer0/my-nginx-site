import { motion } from 'framer-motion';
import { completeRegistration } from '../../services/authService';

export const FirstLoginForm = ({ username, onComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await completeRegistration(username, formData);
      onComplete();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Завершите регистрацию</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Имя</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Фамилия</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition"
        >
          Сохранить данные
        </button>
      </form>
    </motion.div>
  );
};
