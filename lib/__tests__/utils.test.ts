import { cn } from '../utils'

describe('cn', () => {
  it('concatenates classes ignoring falsy values', () => {
    expect(cn('a', 'b', false && 'c')).toBe('a b')
  })

  it('merges duplicate classes', () => {
    expect(cn('text-sm', 'text-sm')).toBe('text-sm')
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })
})
