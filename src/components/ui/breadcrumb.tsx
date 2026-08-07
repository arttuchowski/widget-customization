import * as React from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const Breadcrumb = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav aria-label="breadcrumb" className={cn('text-xs text-muted-foreground', className)} {...props} />
)

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentProps<'ol'>>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('flex flex-wrap items-center gap-1.5', className)} {...props} />
))
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbSeparator = ({ className, ...props }: React.ComponentProps<'li'>) => (
  <li className={cn('[&>svg]:size-3', className)} role="presentation" aria-hidden="true" {...props}>
    <ChevronRight />
  </li>
)

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('font-medium text-foreground', className)} aria-current="page" {...props} />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage }
