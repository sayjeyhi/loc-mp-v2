import * as React from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.ComponentProps<'input'> & {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  /** Number of decimal places to allow (only enforced when type === "number" or you decide) */
  decimalCount?: number
}

function Input({
  className,
  type = 'text',
  prefix,
  suffix,
  decimalCount,
  onChange,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateAndTruncateDecimal = (value: string): string | null => {
    if (decimalCount == null) return value

    // Allow empty string
    if (value === '') return value

    // Prevent multiple decimal points
    const dotCount = (value.match(/\./g) || []).length
    if (dotCount > 1) {
      return null // Invalid
    }

    // Check decimal count
    if (value.includes('.')) {
      const parts = value.split('.')
      if (parts.length > 2) {
        return null // Invalid
      }
      // Check if decimal part exceeds allowed count
      if (parts[1] && parts[1].length > decimalCount) {
        // Truncate to allowed decimal count
        return `${parts[0]}.${parts[1].slice(0, decimalCount)}`
      }
    }

    // Validate pattern
    const escaped = String(decimalCount)
    const regex = new RegExp(`^\\d*\\.?\\d{0,${escaped}}$`)
    
    if (value === '.' || regex.test(value)) {
      return value
    }

    return null // Invalid
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget
    const value = target.value

    if (decimalCount != null && value !== '') {
      const validated = validateAndTruncateDecimal(value)
      if (validated === null) {
        // Restore previous value
        const previousValue = inputRef.current?.getAttribute('data-prev-value') || ''
        if (inputRef.current) {
          inputRef.current.value = previousValue
        }
        return
      }
      
      if (validated !== value && inputRef.current) {
        // Value was truncated, update it
        inputRef.current.value = validated
        // Trigger onChange with corrected value
        const syntheticEvent = {
          ...e,
          target: {
            ...target,
            value: validated,
          },
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(syntheticEvent as any)
        return
      }

      // Store valid value
      if (inputRef.current) {
        inputRef.current.setAttribute('data-prev-value', validated)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (decimalCount != null) {
      const validated = validateAndTruncateDecimal(value)
      if (validated === null) {
        // Invalid input, restore previous value
        const previousValue = inputRef.current?.getAttribute('data-prev-value') || ''
        if (inputRef.current) {
          inputRef.current.value = previousValue
        }
        return
      }

      // Store valid value for next validation
      if (inputRef.current) {
        inputRef.current.setAttribute('data-prev-value', validated)
      }

      // If value was truncated, update input and create synthetic event
      if (validated !== value && inputRef.current) {
        inputRef.current.value = validated
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: validated,
          },
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(syntheticEvent)
        return
      }
    }

    onChange?.(e)
  }

  const hasPrefixOrSuffix = prefix || suffix

  const inputElement = (
    <input
      ref={inputRef}
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-8 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // Only apply border styles when NOT wrapped in prefix/suffix container
        !hasPrefixOrSuffix && 'border-input border shadow-xs',
        !hasPrefixOrSuffix && 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        !hasPrefixOrSuffix && 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // remove horizontal padding when prefix/suffix so the text aligns nicely
        hasPrefixOrSuffix && 'px-2 border-0',
        className
      )}
      onInput={handleInput}
      onChange={handleChange}
      {...props}
    />
  )

  if (!hasPrefixOrSuffix) {
    return inputElement
  }

  return (
    <div
      className={cn(
        'border-input flex h-10 w-full min-w-0 items-center rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] md:text-sm',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
    >
      {prefix && (
        <span className='pr-2 py-2 text-gray-600 dark:text-gray-400'>
          {prefix}
        </span>
      )}
      {React.cloneElement(inputElement, {
        className: cn(
          (inputElement as any).props.className,
          // adjust padding so text does not overlap prefix/suffix
          prefix && 'pl-2',
          suffix && 'pr-2'
        ),
      })}
      {suffix && (
        <span className='text-muted-foreground mr-2 flex items-center text-sm'>
          {suffix}
        </span>
      )}
    </div>
  )
}

export { Input }
