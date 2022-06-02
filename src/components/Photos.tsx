import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Photo } from '../models/photo';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface PhotosProps {
  data: Photo[];
  name: string;
}

const copyToClipboard = (photo: Photo) => {
  const photoUrl = `${photo.url}#width=${photo.width}&height=${photo.height}`;

  if ('clipboardData' in window) {
    const { clipboardData } = window as any;
    return clipboardData.setData("Text", photoUrl);
  }

  if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    const textarea = document.createElement("textarea");
    textarea.textContent = photoUrl;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    }
    catch (ex) {
      return prompt("Copy to clipboard: Ctrl+C, Enter", photoUrl);
    }
    finally {
      document.body.removeChild(textarea);
    }
  }

};


  
export default function Photos(props: PhotosProps) {
  const { name, data } = props;

  const theme = useTheme();
  const sizes = {
    xl: useMediaQuery(theme.breakpoints.only('xl')),
    lg: useMediaQuery(theme.breakpoints.only('lg')),
    md: useMediaQuery(theme.breakpoints.only('md')),  
    sm: useMediaQuery(theme.breakpoints.only('sm')), 
  }

  const getColsByScreenWidth = (): number => {
    if (sizes.xl) {
      return 5;
    } else if (sizes.lg) {
      return 4;
    } else if (sizes.md) {
      return 3;
    } else if (sizes.sm) {
      return 2;
    }
    return 1;
  }


  return (
    <ImageList sx={{ flexGrow: 1, }} cols={getColsByScreenWidth()}>
      <ImageListItem key='Subheader' cols={getColsByScreenWidth()}>
        <ListSubheader component='div'>{name}</ListSubheader>
      </ImageListItem>
      {data.map((item) => (
        <ImageListItem key={item.url}>
          <img src={`${item.url}=w200-h200-c`} alt={item.name} loading='lazy' />
          <ImageListItemBar
            title={item.name}
            subtitle={`${item.width}x${item.height}`}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`copy public url ${item.name}`}
                onClick={() => {
                  copyToClipboard(item);
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
