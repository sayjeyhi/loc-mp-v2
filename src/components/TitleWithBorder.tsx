import { cn } from '@/lib/utils'

type Props = {
  title: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  primaryBorder?: boolean
}

export function TitleWithBorder({
  title,
  className = '',
  size = 'large',
  primaryBorder = false,
}: Props) {
  return (
    <div className={cn('flex flex-wrap justify-between gap-3', className)}>
      <div className='flex flex-wrap items-center gap-3'>
        <div
          className={cn('h-6 w-1 rounded-full', {
            'bg-gray-300': !primaryBorder,
            'bg-primary': primaryBorder,
          })}
        ></div>
        <h2
          className={cn('font-bold tracking-tight', {
            'text-2xl': size === 'large',
            'text-xl': size === 'medium',
            'text-lg': size === 'small',
          })}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}
