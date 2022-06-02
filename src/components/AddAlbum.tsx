import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '../store';
import { addAlbum } from '../store/thunks/addAlbum';

type AddAlbumProps = {};


function AddAlbum(props: AddAlbumProps, ref: Ref<{show: Function}>) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>();
    
    useImperativeHandle(ref, () => ({ show }));
  
    function show(): void {
        setOpen(true);
    }


    const handleClose = () => {
        setOpen(false);
       
    };

    const handleAdd = () => {
        setOpen(false);
        if (url) {
            // https://photos.app.goo.gl/mkvGayXkFwf4jDnn6
            const albumUrl = new URL(url);
            const [,id] = albumUrl.pathname.split('/');
            // const id = 'mkvGayXkFwf4jDnn6';
            console.log('id:', id);
            dispatch(addAlbum(`${id}`));
        }
        
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
        const {target: {name, value}} = event;
        if(name === 'url'){
            setUrl(value);
        }
    }

    return (
       
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Album</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a new album, please enter your shared album link.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Shared URL"
                        type="url"
                        fullWidth
                        variant="standard"
                        placeholder="https://photos.app.goo.gl/{id}"
                        name="url"
                        onChange={(event)=>handleTextChange(event)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
       
    );
}


export default forwardRef(AddAlbum);