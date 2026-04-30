'use client';

import { FilterAltOff } from '@mui/icons-material';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useRef } from 'react';
import { UserRole } from '@/types/user';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface Props {
  defaultSearch: string;
  role?: UserRole;
  isActive?: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value?: UserRole) => void;
  onStatusChange: (value?: boolean) => void;
  onReset: () => void;
}

export const UsersToolbar = ({
  defaultSearch,
  role,
  isActive,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== defaultSearch) {
      inputRef.current.value = defaultSearch;
    }
  }, [defaultSearch]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, 350);

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void => {
    debouncedSearch(event.target.value.trim());
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
      <TextField
        inputRef={inputRef}
        label="Search users"
        placeholder="Username, email, full name"
        defaultValue={defaultSearch}
        onChange={handleSearchInput}
        fullWidth
      />

      <TextField
        select
        label="Role"
        value={role ?? ''}
        onChange={(event) => {
          const nextValue = event.target.value as UserRole | '';
          onRoleChange(nextValue || undefined);
        }}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="">All roles</MenuItem>
        <MenuItem value="ADMIN">Admin</MenuItem>
        <MenuItem value="USER">User</MenuItem>
        <MenuItem value="GUEST">Guest</MenuItem>
      </TextField>

      <TextField
        select
        label="Status"
        value={typeof isActive === 'boolean' ? String(isActive) : ''}
        onChange={(event) => {
          const value = event.target.value;
          if (!value) {
            onStatusChange(undefined);
            return;
          }

          onStatusChange(value === 'true');
        }}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Active</MenuItem>
        <MenuItem value="false">Inactive</MenuItem>
      </TextField>

      <Button startIcon={<FilterAltOff />} sx={{ minWidth: 100, height: "100%" }} onClick={onReset} variant="outlined">
        Reset
      </Button>
    </Stack>
  );
};
