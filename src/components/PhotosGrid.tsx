import React from 'react';
import { Photo } from '../models/photo';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FixedSizeGrid as Grid} from 'react-window';
import { AutoSizer } from 'react-virtualized';

export interface PhotosProps {
  data: Photo[];
  name: string;
}

export default function Photos(props: PhotosProps) {
  const {  data } = props;

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

  // const matrix = data.reduce((rows, key, index) => (index % 3 == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []);

  const colsCount = getColsByScreenWidth();
  const data2 = data as any[];
  const matrix = data2.reduce((rows, key, index) => (index % colsCount == 0 ? rows.push([key]) 
  : rows[rows.length-1].push(key)) && rows, []);

  return (
    <AutoSizer>
      {({height, width}) => (
      <Grid  
        columnCount={colsCount}
        columnWidth={200}
        rowCount={matrix.length}
        rowHeight={200}
        height={height-100}
        width={width}
        
      >
         {({ rowIndex, columnIndex,style }) => {
          const item = matrix[rowIndex][columnIndex];
          if (!item) return (<div style={style}></div>);

          // console.log({rowIndex, columnIndex, item});
        return (
          <div style={style}>
          <img src={`${item.url}=w200-h200-c`} alt={item.filename} loading='lazy' style={{minHeight: "200px"}} />
        </div>
       )

        }}
      </Grid>
      )}
    </AutoSizer>
  
  );
}
