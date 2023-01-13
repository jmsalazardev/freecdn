import React, { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { Album, Photo } from '../models';
import {
  DataGridPro,
  GridCellParams,
  GridColDef,
  MuiEvent,
} from '@mui/x-data-grid-pro';
import { Avatar, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export interface PhotosProps {
  album: Album;
}

export default function Photos(props: PhotosProps) {
  const { album } = props;

  const navigate = useNavigate();
  const [pageSize, setPageSize] = React.useState<number>(20);

  const handleOpenEditor = (photo: Photo) => {
    navigate(`/albums/${album.id}/photo/${photo.id}`);
  };

  const columns: GridColDef<Photo>[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'url',
      headerName: 'Image',
      width: 62,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          sx={{ width: 52, height: 52 }}
          src={`${params.value}=w200-h200-c`}
          variant='rounded'
        />
      ),
    },
    { field: 'filename', headerName: 'Filename', minWidth: 200 },
    { field: 'description', headerName: 'Description', minWidth: 100 },
    { field: 'mimeType', headerName: 'Type', minWidth: 100 },
    {
      field: 'width',
      headerName: 'Width',
      type: 'number',
    },
    {
      field: 'height',
      headerName: 'Height',
      type: 'number',
    },
    {
      field: 'size',
      headerName: 'Size',
      type: 'number',
      resizable: false,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'dateTime',
      valueGetter: ({ value }) => new Date(value * 1.0),
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => {
        const photo = params.row as Photo;

        const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
          e.stopPropagation();
          const { url, width, height, filename, description } = photo;
          const alt = filename
            .split('-')
            .join(' ')
            .replace('.jpg', '')
            .replace('.png', '')
            .replace('.jpeg', '');
          const generatedUrl = `![${alt}](${url}#width=${width}&height=${height} "${description}")`;
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(generatedUrl);
          } else {
            prompt('Copy not supported, please copy manually', generatedUrl);
          }
        };

        return (
          <Button onClick={handleClick}>
            <ContentCopyIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', height: '90%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGridPro
          columnVisibilityModel={{
            id: false,
          }}
          rows={album.photos}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          onCellClick={(
            params: GridCellParams,
            event: MuiEvent<React.MouseEvent>
          ) => {
            event.defaultMuiPrevented = true;
            handleOpenEditor(params.row);
          }}
        />
      </div>
    </div>
  );
}
