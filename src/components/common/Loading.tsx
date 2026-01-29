// ============================================
// Loading Component
// Displays loading spinner with optional text
// ============================================

import { Loader2, BookOpen } from 'lucide-react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'book';
}

const Loading = ({
  text = 'Loading...',
  fullScreen = false,
  size = 'md',
  variant = 'spinner',
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'spinner' ? (
        <Loader2
          className={`${sizeClasses[size]} text-literary-leather animate-spin`}
        />
      ) : (
        <BookOpen
          className={`${sizeClasses[size]} text-literary-leather animate-pulse`}
        />
      )}
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-literary-cream/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default Loading;
