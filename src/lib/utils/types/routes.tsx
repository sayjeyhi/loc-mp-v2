import type { LazyExoticComponent, ReactNode, ReactElement } from 'react'
import type { LayoutType } from './theme'

export interface Meta {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  header?: string | ReactNode
  headerContainer?: boolean
  extraHeader?: LazyExoticComponent<() => ReactElement>
  footer?: boolean
  layout?: LayoutType
}

export type Route = {
  key: string
  path: string
  component: LazyExoticComponent<<T extends Meta>(props: T) => ReactElement>
  authority: string[]
  meta?: Meta
}

export type Routes = Route[]
