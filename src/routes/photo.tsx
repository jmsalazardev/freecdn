import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { RootState, useAppDispatch } from '../store';
import { fetchAlbumById } from '../store/thunks';
import { useParams } from 'react-router-dom';
import PhotoEditor from '../components/PhotoEditor';
import MoreVert from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Menu, MenuItem } from '@mui/material';
import Fab from '@mui/material/Fab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Photo() {
  const { albumId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { album } = useSelector((state: RootState) => state.albumById);

  const photoEditorRef = useRef<{ open: Function; copy: Function }>(null);

  useEffect(() => {
    dispatch(fetchAlbumById(`${albumId}`));
  }, [albumId]);

  if (!album) return <></>;

  const handleBackButtonClick = async () => {
    goBack();
  };

  const goBack = () => {
    navigate(`/albums/${album?.id}`);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    const { current } = photoEditorRef;

    if (current) current.open();
    setAnchorEl(null);
  };

  const handleCopyToClipboard = async () => {
    const { current } = photoEditorRef;

    if (current) current.copy();
    setAnchorEl(null);
  };

  const photo = album.photos.find((item) => item.id === id);

  if (!photo) return <></>;

  return (
    <div
      style={{
        overflowX: 'auto',
      }}
    >
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='back'
            sx={{ mr: 2 }}
            onClick={() => handleBackButtonClick()}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Editor
          </Typography>

          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <MoreVert />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleOpen}>
                <OpenInNewIcon />
                Open
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ marginBottom: '4em' }}>
        <PhotoEditor photo={photo} ref={photoEditorRef} />
      </div>

      <Fab
        color='primary'
        aria-label='add'
        onClick={handleCopyToClipboard}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <ContentCopyIcon />
      </Fab>
    </div>
  );
}
