import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertColor } from '@mui/material';

export interface SimpleSnackbarProps {
  notification: {
    info?: string;
    warning?: string;
    error?: string;
  }
}

export default function SimpleSnackbar(props: SimpleSnackbarProps) {
  const { notification } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  useEffect(() => {
    setOpen(true);
    const {info, warning, error} = notification;
    if (info) {
      setMessage(info);
      setSeverity('info');
    } else if (warning) {
      setMessage(warning);
      setSeverity('warning');
    } else if (error) {
      setMessage(error);
      setSeverity('error');
    }

    
  }, [notification]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        // onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={action}
      >
      
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>

      </Snackbar>
    </div>
  );
}