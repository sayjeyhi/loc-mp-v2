type FooterProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`pt-2 pb-6 text-center text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      &copy; {new Date().getFullYear()} Bizcap. All rights reserved.
    </footer>
  )
}
