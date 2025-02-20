import { Link, LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export function CategoryLink(props: LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'justify-center items-center border border-indigo-50 bg-white p-8 inline-flex w-full h-40 rounded-xl shadow-sm shadow-indigo-200 font-medium text-indigo-700 hover:bg-indigo-50 hover:shadow-indigo-500 transition',
      )}
      {...props}
    />
  )
}
