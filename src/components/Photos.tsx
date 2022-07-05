import React, { useRef } from 'react';
import { Photo } from '../models/photo';
import { DataGridPro, GridCellParams, GridColDef, MuiEvent } from '@mui/x-data-grid-pro';
import { Avatar } from '@mui/material';
import PhotoEditor from './PhotoEditor';

export interface PhotosProps {
  data: Photo[];
  name: string;
}

export default function Photos(props: PhotosProps) {
  const { data } = props;

  const [pageSize, setPageSize] = React.useState<number>(5);

  const photoEditorRef = useRef<{show: Function}>(null);

  const handleOpenEditor = (photo: Photo) => {
    
    
    const {current} = photoEditorRef;
    console.log({current})
    if (current) {
      current.show(photo);
    }
  };

  const columns: GridColDef<Photo>[] = [
    { field: 'id', headerName: 'ID'},
    {
      field: 'url',
      headerName: 'Image',
      width: 62,
      sortable:false,
      filterable: false,
      renderCell: (params) => <Avatar sx={{ width: 52, height: 52 }} src={`${params.value}=w200-h200-c`} variant="rounded" />

    },
    { field: 'filename', headerName: 'Filename', minWidth: 200 },
    { field: 'description', headerName: 'Description', minWidth: 100},
    { field: 'mimeType', headerName: 'Type', minWidth: 100},
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
      resizable: false
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'dateTime',
      valueGetter: ({ value }) => new Date(value * 1.0)
    }
  ];

  return (
    <div style={{ display: 'flex', height: '90%' }}>
      <div style={{flexGrow: 1}}>
        <DataGridPro
          columnVisibilityModel={{
            id: false
          }}
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          onCellClick={(params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
            event.defaultMuiPrevented = true;
            handleOpenEditor(params.row);
          }}
        />
      </div>
      <PhotoEditor ref={photoEditorRef} />
    </div>
  
  );
}
