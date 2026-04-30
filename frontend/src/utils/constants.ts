export const QUERY_KEYS = {
  me: ['auth', 'me'] as const,
  users: <T extends object>(params: T) => ['users', params] as const,
  user: (id: string) => ['users', id] as const,
};

export const ROUTES = {
  login: '/login',
  users: '/dashboard/users',
};
