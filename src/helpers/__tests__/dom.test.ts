import { describe, it, expect } from 'vitest'
import { cn, title } from './dom'

describe('cn', () => {
  it('should merge class names correctly', () => {
    const result = cn('btn', 'btn-primary')
    expect(result).toBe('btn btn-primary')
  })

  it('should handle conditional classes', () => {
    const result = cn('btn', { 'btn-primary': true, 'btn-secondary': false })
    expect(result).toBe('btn btn-primary')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['btn', 'btn-large'], 'text-white')
    expect(result).toBe('btn btn-large text-white')
  })

  it('should handle undefined and null values', () => {
    const result = cn('btn', undefined, null, 'text-white')
    expect(result).toBe('btn text-white')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })
})

describe('title', () => {
  const ROOT_SITE_TITLE = 'Lemfamy Recipes'

  it('should return root site title when no title provided', () => {
    expect(title()).toBe(ROOT_SITE_TITLE)
    expect(title(undefined)).toBe(ROOT_SITE_TITLE)
  })

  it('should join single string with root title', () => {
    const result = title('My Recipe')
    expect(result).toBe('My Recipe | Lemfamy Recipes')
  })

  it('should join array of strings with root title', () => {
    const result = title(['Desserts', 'Chocolate Cake'])
    expect(result).toBe('Desserts | Chocolate Cake | Lemfamy Recipes')
  })

  it('should filter out undefined values from array', () => {
    const result = title(['Desserts', undefined, 'Chocolate Cake'])
    expect(result).toBe('Desserts | Chocolate Cake | Lemfamy Recipes')
  })

  it('should filter out null values from array', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = title(['Desserts', null as any, 'Chocolate Cake'])
    expect(result).toBe('Desserts | Chocolate Cake | Lemfamy Recipes')
  })

  it('should handle empty string in array', () => {
    const result = title(['Desserts', '', 'Chocolate Cake'])
    expect(result).toBe('Desserts | Chocolate Cake | Lemfamy Recipes')
  })

  it('should handle array with only falsy values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = title([undefined, null as any, ''])
    expect(result).toBe(ROOT_SITE_TITLE)
  })

  it('should handle empty array', () => {
    const result = title([])
    expect(result).toBe(ROOT_SITE_TITLE)
  })

  it('should handle single item array', () => {
    const result = title(['Home'])
    expect(result).toBe('Home | Lemfamy Recipes')
  })
})
