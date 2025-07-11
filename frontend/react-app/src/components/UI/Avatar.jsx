export const Avatar = ({ src, size = 'md', editable = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-700 overflow-hidden relative`}>
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white">
          <span className="text-xl">👤</span>
        </div>
      )}
      {editable && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <span className="text-white text-sm">Изменить</span>
        </div>
      )}
    </div>
  );
};
