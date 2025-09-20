export const config = {
  app: {
    name: 'U-fresher ❤',
    url: import.meta.env.VITE_APP_URL || 'https://U-fresher.vercel.app',
    environment: import.meta.env.MODE || 'production'
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  },
  admin: {
    code: 'Createrkkrishavya'
  }
};
