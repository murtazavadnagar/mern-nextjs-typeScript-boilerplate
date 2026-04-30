import { act, renderHook } from '@testing-library/react';
import { useUsersFiltersReducer } from './useUsersFiltersReducer';

describe('useUsersFiltersReducer', () => {
  it('updates search and resets pagination', () => {
    const { result } = renderHook(() => useUsersFiltersReducer());

    expect(result.current.state.page).toBe(1);

    act(() => {
      result.current.dispatch({ type: 'SET_PAGE', payload: 3 });
    });

    expect(result.current.state.page).toBe(3);

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH', payload: 'john' });
    });

    expect(result.current.state.search).toBe('john');
    expect(result.current.state.page).toBe(1);
  });
});
