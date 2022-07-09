import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '../store';
import { addAlbum } from '../store/thunks/addAlbum';
import { fetchAlbums } from '../store/thunks';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import isURL from 'validator/lib/isURL';

type AddAlbumProps = {};

function AddAlbum(props: AddAlbumProps, ref: Ref<{ show: Function }>) {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({ show }));

  function show(): void {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = async (): Promise<void> => {
    if (!url) {
      enqueueSnackbar('Shared URL cannot be empty', { variant: 'error' });
      inputRef.current?.focus();
      return;
    }

    if (!isURL(url)) {
      enqueueSnackbar('Shared URL format is not valid', { variant: 'error' });
      return;
    }

    setLoading(true);

    const albumUrl = new URL(url);
    const [, id] = albumUrl.pathname.split('/');
    await dispatch(addAlbum(`${id}`));

    dispatch(fetchAlbums());
    setLoading(false);
    setOpen(false);
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'url') {
      setUrl(value);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Album</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new album, please enter your shared album link.
        </DialogContentText>
        <TextField
          inputRef={inputRef}
          autoFocus
          margin='dense'
          id='name'
          label='Shared URL'
          type='url'
          fullWidth
          variant='standard'
          placeholder='https://photos.app.goo.gl/{id}'
          name='url'
          onChange={(event) => handleTextChange(event)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='contained' onClick={handleAdd} disabled={loading}>
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
              }}
            />
          ) : (
            'Add'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default forwardRef(AddAlbum);
