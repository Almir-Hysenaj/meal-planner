import { useEffect } from 'react';

interface MessageModalProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const MessageModal = ({ type, message, onClose }: MessageModalProps) => {
  const isSuccess = type === 'success';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed right-4 top-20 z-50 w-full max-w-sm rounded-xl border bg-white p-4 shadow-lg ${
        isSuccess ? 'border-emerald-200' : 'border-red-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h2
            className={`font-semibold ${
              isSuccess ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {isSuccess ? 'Success' : 'Error'}
          </h2>

          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
