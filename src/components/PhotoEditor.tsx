import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Photo } from '../models/photo';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import IconButton from '@mui/material/IconButton';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { aspectRatioPressets, sizePressets, imageFormats } from '../config';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

type PhotoEditorProps = {};

function PhotoEditor(props: PhotoEditorProps, ref: Ref<{ show: Function }>) {
  const [photo, setPhoto] = useState<Photo>();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const [flipVert, setFlipVert] = useState<number>(1);
  const [flipHoriz, setFlipHoriz] = useState<number>(1);
  const [format, setFormat] = useState<string>('rj');
  const [aspectRatioPresset, setAspectRatioPresset] = useState<string>(
    'aspect-ratio-custom'
  );
  const [sizePresset, setSizePresset] = useState<string>('size-custom');

  useEffect(() => {
    /*
    console.log('dataUpdated', {
      zoom,
      flipHoriz,
      flipVert,
      rotation,
      aspectRatioPresset,
    });
    */

    if (!cropperRef.current) return;

    const { cropper } = cropperRef.current;

    cropper.scale(flipHoriz, flipVert);

    cropper.rotateTo(rotation);

    cropper.zoomTo(zoom);

    const selectedAspectRatio = aspectRatioPressets.find(
      (item) => item.id === aspectRatioPresset
    );
    if (selectedAspectRatio) {
      const { width, height } = selectedAspectRatio;
      cropper.setAspectRatio(width / height);
    }

    const selectedSize = sizePressets.find((item) => item.id === sizePresset);
    if (selectedSize && selectedSize.id !== 'size-custom') {
      setWidth(selectedSize.width);
      setHeight(selectedSize.height);
    } else {
      const cropData = cropper.getData();
      setWidth(Math.round(cropData.width));
      setHeight(Math.round(cropData.height));
    }
  }, [aspectRatioPresset, sizePresset, flipHoriz, flipVert, rotation, zoom]);

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useImperativeHandle(ref, () => ({ show }));

  function show(selectedPhoto: Photo): void {
    setPhoto(selectedPhoto);
    // setSize(selectedPhoto.width);
    setWidth(selectedPhoto.width);
    setHeight(selectedPhoto.height);

    setSizePresset('size-custom');
    setAspectRatioPresset('aspect-ratio-custom');

    setOpen(true);
  }

  const getUrl = (): string | null => {
    if (!cropperRef.current) return null;

    const { cropper } = cropperRef.current;

    if (!photo) return null;

    const cropData = cropper.getData();
    const cropBoxData = cropper.getCropBoxData();
    const canvasData = cropper.getCanvasData();
    const imageData = cropper.getImageData();

    const a = dec2Hex(
      Math.round(
        ((cropBoxData.left - canvasData.left) * 65535) / imageData.width
      ),
      4
    );
    const b = dec2Hex(
      Math.round(
        ((cropBoxData.top - canvasData.top) * 65535) / imageData.height
      ),
      4
    );
    const c = dec2Hex(
      Math.round(
        ((cropBoxData.left - canvasData.left + cropBoxData.width) * 65535) /
          imageData.width
      ),
      4
    );
    const d = dec2Hex(
      Math.round(
        ((cropBoxData.top - canvasData.top + cropBoxData.height) * 65535) /
          imageData.height
      ),
      4
    );

    const fcrop64 = `fcrop64=1,${a}${b}${c}${d}`;

    let outputWidth = width;
    let outputHeight = height;

    const selectedFormat = imageFormats.find((item) => item.value === format);
    const outputFormat = selectedFormat ? selectedFormat.value : 'rj';

    const params = [
      `w${outputWidth}`,
      `h${outputHeight}`,
      'n',
      fcrop64,
      outputFormat,
    ];

    if (cropData.scaleX === -1) params.push('fh');
    if (cropData.scaleY === -1) params.push('fv');

    const generatedUrl = `${photo.url}=${params.join('-')}`;

    console.log('generatedUrl:', generatedUrl);
    return generatedUrl;
  };

  const handleOpenClick = () => {
    const generatedUrl = getUrl();
    if (generatedUrl) window.open(generatedUrl);
  };

  const copyToClipboard = async () => {
    const generatedUrl = getUrl();

    await navigator.clipboard.writeText(`${generatedUrl}`);
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setFormat(event.target.value);
  };

  const handleAspectRatioPressetChange = (event: SelectChangeEvent) => {
    const id = event.target.value;

    setAspectRatioPresset(id);
    setSizePresset('size-custom');
  };

  const handleSizePressetChange = (event: SelectChangeEvent) => {
    const id = event.target.value;

    console.log('handleSizePressetChange', id);
    setSizePresset(id);
  };

  const handleSizeChange = (event: Event, newValue: number | number[]) => {
    if (!photo) return;
    let newWidth = Array.isArray(newValue) ? newValue[0] : newValue;

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

  const dec2Hex = (d: number, padding: number) => {
    var hex = Number(d).toString(16);
    padding =
      typeof padding === 'undefined' || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = '0' + hex;
    }

    return hex.toUpperCase();
  };

  const cropperRef = useRef<ReactCropperElement>(null);

  const onSwapHoriz = () => {
    setFlipHoriz(flipHoriz * -1);
  };

  const onSwapVert = () => {
    setFlipVert(flipVert * -1);
  };

  const onRotateRight = () => {
    const newRotation = rotation + 90;
    setRotation(newRotation === 360 ? 0 : newRotation);
  };

  const onRotateLeft = () => {
    const newRotation = rotation - 90;
    setRotation(newRotation === -360 ? 0 : newRotation);
  };

  const onZoomIn = () => {
    setZoom(zoom + 0.5);
  };

  const onZoomOut = () => {
    setZoom(zoom - 0.5);
  };

  const marks = [
    {
      value: 10,
      label: '10px',
    },
    {
      value: 320,
      label: '320px',
    },
    {
      value: 540,
      label: '540px',
    },
    {
      value: 720,
      label: '720px',
    },
    {
      value: 960,
      label: '960px',
    },
    {
      value: 1140,
      label: '1140px',
    },
    {
      value: 1600,
      label: '1600px',
    },
    {
      value: 1920,
      label: '1920px',
    },
    {
      value: 2560,
      label: '2560px',
    },
  ];

  if (!photo) return <></>;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Metadata
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                id='filename-input'
                label='Filename'
                defaultValue={photo.filename}
                InputProps={{
                  readOnly: true,
                }}
                variant='standard'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id='description-input'
                label='Description'
                defaultValue={photo.description}
                InputProps={{
                  readOnly: true,
                }}
                variant='standard'
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='width-input'
                label='Width'
                defaultValue={photo.width}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>px</InputAdornment>
                  ),
                }}
                variant='standard'
                fullWidth
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                id='height-input'
                label='Height'
                defaultValue={photo.height}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>px</InputAdornment>
                  ),
                }}
                variant='standard'
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='size-input'
                label='Size'
                defaultValue={photo.size}
                InputProps={{
                  readOnly: true,

                  endAdornment: (
                    <InputAdornment position='end'>kb</InputAdornment>
                  ),
                }}
                variant='standard'
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='mimetype-input'
                label='Mime Type'
                defaultValue={photo.mimeType}
                InputProps={{
                  readOnly: true,
                }}
                variant='standard'
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <IconButton
                color='primary'
                aria-label='rotate-left'
                component='span'
                onClick={onSwapVert}
              >
                <SwapVertIcon />
              </IconButton>

              <IconButton
                color='primary'
                aria-label='rotate-left'
                component='span'
                onClick={onSwapHoriz}
              >
                <SwapHorizIcon />
              </IconButton>

              <IconButton
                color='primary'
                aria-label='rotate-left'
                component='span'
                onClick={onRotateLeft}
              >
                <Rotate90DegreesCcwIcon />
              </IconButton>

              <IconButton
                color='primary'
                aria-label='rotate-right'
                component='span'
                onClick={onRotateRight}
              >
                <Rotate90DegreesCwIcon />
              </IconButton>

              <IconButton
                color='primary'
                aria-label='zoom-in'
                component='span'
                onClick={onZoomIn}
              >
                <ZoomInIcon />
              </IconButton>

              <IconButton
                color='primary'
                aria-label='zoom-in'
                component='span'
                onClick={onZoomOut}
              >
                <ZoomOutIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Editor
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Cropper
                src={`${photo.url}=w${photo.width}-h${photo.height}`}
                style={{ height: 400, width: '100%' }}
                // Cropper.js options
                initialAspectRatio={16 / 9}
                guides={false}
                ref={cropperRef}
                checkCrossOrigin={false}
                viewMode={1}
                autoCropArea={100}
                center={true}
                // toggleDragModeOnDblclick={false}
                // cropBoxResizable={false}
              />
            </Grid>

            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <InputLabel id='select-aspect-ratio-presset'>
                Aspect Ratio
              </InputLabel>

              <Select
                labelId='select-aspect-ratio-presset'
                value={aspectRatioPresset}
                label='Aspect Ratio'
                onChange={handleAspectRatioPressetChange}
              >
                {aspectRatioPressets.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <InputLabel id='select-size-presset'>Size</InputLabel>
              <Select
                labelId='select-size-presset'
                value={sizePresset}
                label='Size'
                onChange={handleSizePressetChange}
              >
                {sizePressets
                  .filter(
                    (item) =>
                      item.aspectRatioRef === 'aspect-ratio-custom' ||
                      item.aspectRatioRef === aspectRatioPresset
                  )
                  .map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <InputLabel id='select-image-format'>Format</InputLabel>
              <Select
                labelId='select-image-format'
                value={format}
                label='Format'
                onChange={handleFormatChange}
              >
                {imageFormats.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid item xs={12}>
              <Slider
                step={1}
                min={10}
                max={2048}
                value={width}
                onChange={handleSizeChange}
                aria-labelledby='input-slider'
                marks={marks}
                disabled={sizePresset !== 'size-custom'}
                valueLabelDisplay='off'
              />
            </Grid>

            <Grid item xs={4}>
              Size: {width}x{height}
            </Grid>

            <Grid item xs={2}>
              <Button
                size='small'
                variant='contained'
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  copyToClipboard();
                }}
              >
                Copy
              </Button>
            </Grid>

            <Grid item xs={2}>
              <Button
                size='small'
                variant='contained'
                startIcon={<OpenInNewIcon />}
                onClick={handleOpenClick}
              >
                Open
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default forwardRef(PhotoEditor);
