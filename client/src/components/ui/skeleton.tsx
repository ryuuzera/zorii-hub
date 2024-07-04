import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-primary/30', className)} {...props} />;
}

export { Skeleton };
