'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { User } from '@/types/user';

interface Props {
  open: boolean;
  user?: User;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const UserDeleteDialog = ({ open, user, isSubmitting, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography pt={1}>
          Delete user <strong>{user?.fullName}</strong>? This is a soft delete.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, mb: 2 }}>
        <Button
          sx={{ height: 56, minWidth: 150, mr: 2 }}
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          sx={{ height: 56, minWidth: 150 }}
          onClick={() => void onConfirm()}
          variant="contained"
          color="error"
          disabled={isSubmitting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
