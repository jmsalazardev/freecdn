import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

import { RootState, useAppDispatch } from '../store';
import { fetchPhotosByAlbumId } from '../store/thunks';
import { fetchAlbums } from '../store/thunks';
import { useParams } from 'react-router-dom';
import Photos from '../components/Photos';
import { Photo } from '../models/photo';
import { Menu, MenuItem } from '@mui/material';
import { syncAlbum } from '../store/thunks/syncAlbum';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Album() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { photos } = useSelector((state: RootState) => state.photos);
  const { albums } = useSelector((state: RootState) => state.albums);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSync = () => {
    dispatch(syncAlbum(`${id}`));
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchPhotosByAlbumId(`${id}`));
  }, []);

  useEffect(() => {
    clearFilter();
  }, [photos]);

  const [album] = albums.filter((item) => item.id === id);

  const albumTitle = album?.title || '';

  const [enteredText, setEnteredText] = useState('');

  const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      return clearFilter();
    }

    const criteria = enteredText.trim();
    if (criteria.length > 0) {
      const regex = new RegExp(criteria, 'g');
      setFilteredPhotos(photos.filter(({ name }) => name.match(regex)));
    } else {
      clearFilter();
    }
  };

  const handleBackButtonClick = async () => {
    navigate('/albums');
  };

  const clearFilter = () => {
    setEnteredText('');
    setFilteredPhotos(photos);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          ></Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
              value={enteredText}
              onKeyUp={keyUpHandler}
              onChange={(e) => setEnteredText(e.target.value)}
            />
          </Search>

          <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MoreVert />
              </IconButton>
              <Menu
                id="menu-appbar"
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
                <MenuItem onClick={handleSync}>Sync</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <Photos name={albumTitle} data={filteredPhotos} />
    </Box>
  );
}
