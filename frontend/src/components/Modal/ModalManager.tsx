import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { createPortal } from 'react-dom';
import { useModalStore } from '../../stores/zubstand';
import { AddCommunity } from './contentModals/AddCommunity/AddCommunity';
import { SelectActivityModal } from './contentModals/SelectActivityModal';
import { useState } from 'react';

export const ModalManager = () => {
  const { isOpen, closeModal, modalType } = useModalStore();
  const [disableClose, setDisableClose] = useState(false);

  if (!isOpen) {
    return null; // Note: no renderiza nada si no hay modal abierto.
  }

  let modalContent = null;

  switch (modalType) {
    case 'selectActivity':
      modalContent = <SelectActivityModal />;
      break;
    case 'addCommunity':
      modalContent = <AddCommunity setDisableClose={setDisableClose} />;
      break;
    default:
      modalContent = <Typography>No hay contenido disponible.</Typography>;
  }

  const handleClose = () => {
    if (!disableClose) {
      closeModal();
    }
  };

  return createPortal(
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'hidden',
          maxWidth: '520px',
          width: '100%',
        },
      }}
    >
      <DialogContent
        sx={{
          padding: '40px 16px 20px',
          overflow: 'hidden',
        }}
      >
        {modalContent}
        <IconButton
          aria-label="delete"
          onClick={handleClose}
          disabled={disableClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogContent>
    </Dialog>,
    document.body
  );
};
