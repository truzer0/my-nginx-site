export const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl ${className}`}>
      {children}
    </div>
  );
};
