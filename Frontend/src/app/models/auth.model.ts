export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string | null;
}
