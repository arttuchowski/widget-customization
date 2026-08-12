import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-[var(--widget-input-border,hsl(var(--input)))] bg-[var(--widget-input-bg,#ffffff)] px-3 py-1 text-sm text-[var(--widget-input-text,hsl(var(--foreground)))] shadow-sm transition-colors placeholder:text-[var(--widget-input-placeholder,hsl(var(--muted-foreground)))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-input-ring,hsl(var(--ring)))] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
