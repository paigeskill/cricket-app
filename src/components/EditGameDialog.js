import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GameForm from './GameForm';

/**
 * A modular Dialog modal component to wrap edit-game workflows consistently.
 * Extracts Dialog layout and close actions from page-level managers.
 * @param {boolean} open - Dialog visible state
 * @param {function} onClose - Modal close callback
 * @param {object} game - Game details object being edited (null if closed)
 * @param {number} defaultTab - Tab index focus when the form mounts
 * @param {function} onSave - Submit save callback passing the updated game object
 */
function EditGameDialog({ open, onClose, game, defaultTab, onSave }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 'bold', pr: 6 }}>
        Edit Game Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {game && (
          <GameForm
            initialData={game}
            defaultTab={defaultTab}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditGameDialog;
