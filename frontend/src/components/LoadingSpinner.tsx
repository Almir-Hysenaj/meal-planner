interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-10 w-10 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-gray-200 border-t-emerald-600 ${sizes[size]}`}
    />
  );
};

export default LoadingSpinner;
