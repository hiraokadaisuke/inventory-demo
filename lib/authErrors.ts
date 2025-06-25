export function translateAuthError(msg: string): string {
  switch (msg) {
    case 'Invalid login credentials':
      return 'メールアドレスまたはパスワードが間違っています';
    case 'Email not confirmed':
      return 'メールアドレスが確認されていません';
    case 'User already registered':
      return 'すでに登録済みのメールアドレスです';
    default:
      return msg;
  }
}
