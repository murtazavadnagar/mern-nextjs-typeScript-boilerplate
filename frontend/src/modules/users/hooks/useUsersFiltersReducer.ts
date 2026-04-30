'use client';

import { Reducer, useMemo, useReducer } from 'react';
import { UserRole, UsersQueryParams } from '@/types/user';

interface UsersFilterState {
  page: number;
  limit: number;
  search: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy: UsersQueryParams['sortBy'];
  sortOrder: UsersQueryParams['sortOrder'];
}

type UsersFilterAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_LIMIT'; payload: number }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_ROLE'; payload?: UserRole }
  | { type: 'SET_IS_ACTIVE'; payload?: boolean }
  | { type: 'SET_SORT'; payload: { sortBy: UsersFilterState['sortBy']; sortOrder: UsersFilterState['sortOrder'] } }
  | { type: 'RESET' };

const initialState: UsersFilterState = {
  page: 1,
  limit: 5,
  search: '',
  role: undefined,
  isActive: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const reducer: Reducer<UsersFilterState, UsersFilterAction> = (state, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, page: 1, limit: action.payload };
    case 'SET_SEARCH':
      return { ...state, page: 1, search: action.payload };
    case 'SET_ROLE':
      return { ...state, page: 1, role: action.payload };
    case 'SET_IS_ACTIVE':
      return { ...state, page: 1, isActive: action.payload };
    case 'SET_SORT':
      return {
        ...state,
        page: 1,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const useUsersFiltersReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const queryParams = useMemo<UsersQueryParams>(
    () => ({
      page: state.page,
      limit: state.limit,
      search: state.search || undefined,
      role: state.role,
      isActive: state.isActive,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    }),
    [state],
  );

  return {
    state,
    dispatch,
    queryParams,
  };
};
