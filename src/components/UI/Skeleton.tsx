import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-2">
          {skeletonElement}
        </div>
      ))}
    </>
  );
};

// Card Skeleton for list items
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mb-4"
      >
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={16} />
          </div>
        </div>
        <Skeleton count={3} />
      </div>
    ))}
  </>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number; rows?: number }> = ({
  columns = 4,
  rows = 5,
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b dark:border-gray-700">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <Skeleton width="90%" height={16} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// Dashboard Card Skeleton
export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton width={120} height={20} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton width={80} height={32} className="mb-2" />
    <Skeleton width="60%" height={16} />
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton variant="circular" width={64} height={64} />
    <div className="flex-1 space-y-2">
      <Skeleton width="50%" height={24} />
      <Skeleton width="70%" height={16} />
      <Skeleton width="40%" height={16} />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton width={100} height={16} />
        <Skeleton width="100%" height={40} variant="rounded" />
      </div>
    ))}
  </div>
);

export default Skeleton;
