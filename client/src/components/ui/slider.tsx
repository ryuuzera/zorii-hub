'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  return (
    <SliderPrimitive.Root
      ref={ref}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative flex w-full touch-none select-none items-center cursor-pointer', className)}
      {...props}>
      <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
        <SliderPrimitive.Range className={`absolute h-full bg-red-500`} />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={`block transition-all delay-100 h-3 w-3 rounded-full border-red-500 bg-red-500
        } shadow  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };