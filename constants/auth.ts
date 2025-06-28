export const VALID_AUTH_ROUTES = [
  'login',
  'register', 
  'reset-password',
  'confirm-reset-password'
] as const;

export type ValidAuthRoute = typeof VALID_AUTH_ROUTES[number];