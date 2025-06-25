const ORIGINAL_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ORIGINAL_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ORIGINAL_KEY
  jest.resetModules()
})

describe('supabase client env checks', () => {
  it('throws when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key'
    expect(() => require('../supabase')).toThrow('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'url'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(() => require('../supabase')).toThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('exports client when variables are set', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key'
    const { supabase } = require('../supabase')
    expect(supabase).toBeDefined()
  })
})
