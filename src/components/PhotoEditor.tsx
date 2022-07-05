import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Photo } from '../models/photo';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// import SizeSlider from './SizeSlider';
import { Button, Checkbox, Input } from '@mui/material';
import Slider from '@mui/material/Slider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

/*
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
*/

type PhotoEditorProps = {};

function PhotoEditor(props: PhotoEditorProps, ref: Ref<{show: Function}>) {
  const [photo, setPhoto] = useState<Photo>();
  const [open, setOpen] = useState(false);
  const [size, setSize] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);
  const [useHash, setUseHash] = React.useState<boolean>(true);
  

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useImperativeHandle(ref, () => ({ show }));

  function show(selectedPhoto: Photo): void {
    console.log('show', selectedPhoto, photo);
    setPhoto(selectedPhoto);
    setSize(selectedPhoto.width);
    setWidth(selectedPhoto.width);
    setHeight(selectedPhoto.height);
   

    setOpen(true);
  }

  const copyToClipboard = async () => {
    if (!photo) return;
    let url = '';
    if (useHash === true) {
      url = `${photo.url}#width=${width}&height=${height}`;
    } else {
      url = `${photo.url}=s${width}`;
    }

    await navigator.clipboard.writeText(url);
  
  };
  

  const handleHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseHash(event.target.checked);
  };


  const handleSizeChange = (event: Event, newValue: number | number[]) => {
    if (!photo) return;
    let newWidth = Array.isArray(newValue) ? newValue[0] : newValue;
    setSize(newWidth);


    let aspectRatio = 1;
    let newHeight = 0;
    if (width > height) {
      aspectRatio = width / height;
      newHeight = Math.round(newWidth / aspectRatio);
    } else if (height > width) {
        aspectRatio = height / width;
        newHeight = Math.round(newWidth * aspectRatio);
    } else {
        newHeight = newWidth;
    }

    
    setHeight(newHeight);
    setWidth(newWidth);
    

  };

  if (!photo) return (<></>);

  return (
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {photo?.filename}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {photo?.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
            
                <img src={photo?.url} style={{width: '100%'}} />
            </Grid>
            
            <Grid item xs={12}>
              <Slider
              min={10}
              max={photo.width}
              value={typeof size === 'number' ? size : 10}
              onChange={handleSizeChange}
              aria-labelledby="input-slider"
            />
            </Grid>

            <Grid item xs={4}>
              Width
              <Input
                value={typeof width === 'number' ? width : 0}
                size="small"
                
              />
            </Grid>
            <Grid item xs={4}>
              Height
              <Input
                value={typeof height === 'number' ? height : 0}
                size="small"
                
              />
            </Grid>
            <Grid item xs={4}>
              Use Hash
              <Checkbox checked={useHash} onChange={handleHashChange} />
            </Grid>

          
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<ContentCopyIcon />} 
                onClick={() => {
                  copyToClipboard();
                }}
              >
                Copy
              </Button>
            </Grid>

            
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default forwardRef(PhotoEditor);