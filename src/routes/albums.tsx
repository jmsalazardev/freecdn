import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../store';
import { fetchAlbums } from '../store/thunks';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AddAlbum from '../components/AddAlbum';

export default function Albums() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const addAlbumRef = useRef<{show: Function}>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBackButtonClick = async () => {
    navigate('/');
  };

  const handleAdd = () => {
    setAnchorEl(null);
    
    const {current} = addAlbumRef;
    if (current) {
      current.show();
    }
  };

  const handleRefresh = () => {
    setAnchorEl(null);
    dispatch(fetchAlbums());
  };
  

  const { albums } = useSelector((state: RootState) => state.albums);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleListItemClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    const { id } = albums[index];
    navigate(id);
  };

  const hasAlbum = albums.length > 0;

  const items = hasAlbum ?
    albums.map((album, index) => (
        <ListItemButton
          key={album.id}
          selected={selectedIndex === index}
          onClick={(event) => handleListItemClick(event, index)}
        >
          <ListItemText primary={album.title} secondary={album.url} />
        </ListItemButton>
    )) :
    <ListItemText key='Subheader' primary="No albums found" />;

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
                <MenuItem onClick={handleAdd}>Add</MenuItem>
                <MenuItem onClick={handleRefresh}>Refresh</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>

      <List component='nav' aria-labelledby='list-subheader'>
        {items}
      </List>

      <AddAlbum ref={addAlbumRef} />
    </Box>
  );
}
