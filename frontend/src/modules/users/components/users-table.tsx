'use client';

import Link from 'next/link';
import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { User } from '@/types/user';

interface Props {
  users: User[];
  page: number;
  limit: number;
  total: number;
  isLoading: boolean;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable = ({
  users,
  page,
  limit,
  total,
  isLoading,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography align="center" color="text.secondary" py={3}>
                    No users found for the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end">
                    <Tooltip title="View">
                      <IconButton
                        component={Link}
                        href={`/dashboard/users/${user.id}`}
                        size="small"
                        aria-label={`view-${user.id}`}
                      >
                        <VisibilityOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEdit(user)} size="small" aria-label={`edit-${user.id}`}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => onDelete(user)}
                        size="small"
                        color="error"
                        aria-label={`delete-${user.id}`}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_event, nextPage) => {
          onPageChange(nextPage + 1);
        }}
        rowsPerPage={limit}
        rowsPerPageOptions={[2, 5, 10, 20, 50]}
        onRowsPerPageChange={(event) => {
          onLimitChange(Number(event.target.value));
        }}
      />
    </Paper>
  );
};
