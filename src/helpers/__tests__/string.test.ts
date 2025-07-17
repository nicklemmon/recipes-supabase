import { describe, expect, it } from 'vitest'
import { slugify } from '../string'

describe('slugify', () => {
  it('should convert basic strings to slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('My Recipe Name')).toBe('my-recipe-name')
  })

  it('should handle strings with diacritical marks', () => {
    expect(slugify('Café Moché')).toBe('cafe-moche')
    expect(slugify('naïve résumé')).toBe('naive-resume')
    expect(slugify('jalapeño piñata')).toBe('jalapeno-pinata')
  })

  it('should handle underscores and convert to hyphens', () => {
    expect(slugify('hello_world_test')).toBe('hello-world-test')
    expect(slugify('some_text with spaces')).toBe('some-text-with-spaces')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! @#$% World?')).toBe('hello-world')
    expect(slugify('Test & More')).toBe('test-more')
    expect(slugify('Price: $19.99')).toBe('price-1999')
  })

  it('should collapse multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
    expect(slugify('test  --  more')).toBe('test-more')
  })

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('-hello-world-')).toBe('hello-world')
    expect(slugify('---test---')).toBe('test')
  })

  it('should handle mixed cases', () => {
    expect(slugify('HeLLo WoRLd')).toBe('hello-world')
    expect(slugify('CamelCaseText')).toBe('camelcasetext')
  })

  it('should handle numbers', () => {
    expect(slugify('Recipe 123')).toBe('recipe-123')
    expect(slugify('Test 2024 Version')).toBe('test-2024-version')
  })

  it('should handle empty and whitespace strings', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
    expect(slugify('\t\n\r')).toBe('')
  })

  it('should handle strings with only special characters', () => {
    expect(slugify('!@#$%^&*()')).toBe('')
    expect(slugify('---')).toBe('')
  })

  it('should handle complex real-world examples', () => {
    expect(slugify("Grandma's Famous Apple Pie Recipe")).toBe('grandmas-famous-apple-pie-recipe')
    expect(slugify('Spicy Jalapeño & Cheese Dip (HOT!)')).toBe('spicy-jalapeno-cheese-dip-hot')
    expect(slugify('5-Minute Microwave Mug Cake')).toBe('5-minute-microwave-mug-cake')
  })

  it('should handle strings with consecutive spaces', () => {
    expect(slugify('hello    world')).toBe('hello-world')
    expect(slugify('test   multiple   spaces')).toBe('test-multiple-spaces')
  })

  it('should handle mixed separators', () => {
    expect(slugify('hello_world test-case')).toBe('hello-world-test-case')
    expect(slugify('mixed___spaces   and---hyphens')).toBe('mixed-spaces-and-hyphens')
  })

  it('should preserve alphanumeric characters', () => {
    expect(slugify('abc123def456')).toBe('abc123def456')
    expect(slugify('test123 more456')).toBe('test123-more456')
  })
})
