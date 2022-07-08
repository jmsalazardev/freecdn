import React, {
  useEffect,
  useRef,
  useState,
  Ref,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Photo } from '../models/photo';
import Grid from '@mui/material/Grid';
import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import IconButton from '@mui/material/IconButton';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { aspectRatioPressets, sizePressets, imageFormats } from '../config';

type PhotoEditorProps = {
  photo: Photo;
};

function PhotoEditor(
  props: PhotoEditorProps,
  ref: Ref<{ open: Function; copy: Function }>
) {
  const { photo } = props;

  const cropperRef = useRef<ReactCropperElement>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(photo?.height || 0);
  const [width, setWidth] = useState<number>(photo?.width || 0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const [flipVert, setFlipVert] = useState<number>(1);
  const [flipHoriz, setFlipHoriz] = useState<number>(1);
  const [format, setFormat] = useState<string>('rj');
  const [aspectRatioPresset, setAspectRatioPresset] = useState<string>(
    'aspect-ratio-custom'
  );
  const [sizePresset, setSizePresset] = useState<string>('size-custom');

  useImperativeHandle(ref, () => ({ open, copy }));

  function open(): void {
    console.log('open!');
    const generatedUrl = getUrl();
    if (generatedUrl) window.open(generatedUrl);
  }

  async function copy(): Promise<string> {
    const generatedUrl = `${getUrl()}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(generatedUrl);
    }

    return generatedUrl;
  }

  useEffect(() => {
    console.log({ isLoaded });
    if (!isLoaded) return;
    if (!cropperRef.current) return;
    const { cropper } = cropperRef.current;
    if (!cropper) return;

    console.log('dataUpdated', {
      zoom,
      flipHoriz,
      flipVert,
      rotation,
      aspectRatioPresset,
    });

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
  }, [
    isLoaded,
    aspectRatioPresset,
    sizePresset,
    flipHoriz,
    flipVert,
    rotation,
    zoom,
  ]);

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

  const handleCropperReady = () => {
    setIsLoaded(true);
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

  return (
    <div style={{ display: 'flex', height: '90%' }}>
      <div style={{ flexGrow: 1, padding: '1em' }}>
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
          <Grid item xs={6} md={3}>
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

          <Grid item xs={6} md={3}>
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
          <Grid item xs={6} md={3}>
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
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={3}>
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
            <Cropper
              src={`${photo.url}=w${photo.width}-h${photo.height}`}
              // style={{ height: 400, width: '100%' }}
              // Cropper.js options
              initialAspectRatio={16 / 9}
              guides={false}
              ref={cropperRef}
              checkCrossOrigin={false}
              viewMode={1}
              autoCropArea={100}
              center={true}
              ready={handleCropperReady}

              // toggleDragModeOnDblclick={false}
              // cropBoxResizable={false}
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

          <Grid item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <InputLabel id='select-aspect-ratio-presset'>
                Aspect Ratio
              </InputLabel>

              <Select
                labelId='select-aspect-ratio-presset'
                value={aspectRatioPresset}
                label='Aspect Ratio'
                onChange={handleAspectRatioPressetChange}
                fullWidth
              >
                {aspectRatioPressets.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <InputLabel id='select-size-presset'>Size</InputLabel>
              <Select
                labelId='select-size-presset'
                value={sizePresset}
                label='Size'
                onChange={handleSizePressetChange}
                fullWidth
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
          </Grid>

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

          <Grid item xs={6}>
            <TextField
              id='size-input'
              label='Size'
              value={width + 'x' + height}
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

          <Grid item xs={6}>
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
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default forwardRef(PhotoEditor);
