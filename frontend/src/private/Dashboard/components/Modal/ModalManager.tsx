import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { createPortal } from 'react-dom';
import { AddCommunity } from './contentModals/AddCommunity/AddCommunity';
import { SelectActivityModal } from './contentModals/SelectActivityModal';
import { useState } from 'react';
import {
  useCommunityDetailsStore,
  useModalStore,
} from '../../../../stores/zubstand';
import { InviteLink } from './contentModals/InviteLink/InviteLink';
import { useParams } from 'react-router-dom';

export const ModalManager = () => {
  const { communityId } = useParams();
  const { isOpen, closeModal, modalType } = useModalStore();
  const [disableClose, setDisableClose] = useState(false);
  const { getCommunityDetails } = useCommunityDetailsStore();

  if (!isOpen) {
    return null; // Note: no renderiza nada si no hay modal abierto.
  }

  let modalContent = null;
  const communityDetails = getCommunityDetails(communityId || '');

  switch (modalType) {
    case 'selectActivity':
      modalContent = <SelectActivityModal />;
      break;
    case 'addCommunity':
      modalContent = <AddCommunity setDisableClose={setDisableClose} />;
      break;
    case 'inviteLink':
      modalContent = <InviteLink token={communityDetails?.inviteToken} />;
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
