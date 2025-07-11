import { motion } from 'framer-motion';

export const GradientBg = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900"
    >
      {children}
    </motion.div>
  );
};
