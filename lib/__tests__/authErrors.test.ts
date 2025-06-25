import { translateAuthError } from '../authErrors'

describe('translateAuthError', () => {
  it('translates known messages', () => {
    expect(translateAuthError('Invalid login credentials')).toBe('メールアドレスまたはパスワードが間違っています')
    expect(translateAuthError('Email not confirmed')).toBe('メールアドレスが確認されていません')
    expect(translateAuthError('User already registered')).toBe('すでに登録済みのメールアドレスです')
  })

  it('returns original message for unknown errors', () => {
    expect(translateAuthError('Something else')).toBe('Something else')
  })
})
