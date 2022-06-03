import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Home() {
  const openScraperWindow = () => {
    window.open('https://github.com/jmsalazardev/gphotos-cdn', '_blank');
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
       <AppBar position='static'>
        <Toolbar>
          <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              GPHOTOS-CDN
            </Typography>
        </Toolbar>
        </AppBar>
        <nav>
          <List>
            <ListItem disablePadding component={Link} to='/albums'>
              <ListItemButton>
                <ListItemIcon>
                  <PhotoLibraryIcon />
                </ListItemIcon>
                <ListItemText primary="Albums" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding onClick={() => { openScraperWindow() }}>
              <ListItemButton>
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="Repository" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
    </Box>
  );
}
