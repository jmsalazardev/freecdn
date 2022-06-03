import React, { FormEvent, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Container, Grid, TextField } from '@mui/material';
import { logIn } from '../services/auth-service';
import SimpleSnackbar from '../components/SimpleSnackbar';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({});
  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { username, password } = credential;
    if (username.trim().length === 0) {
      setSnackbar({ warning: 'Please enter your username' });
      return;
    }

    if (password.trim().length === 0) {
      setSnackbar({ warning: 'Please enter your password' });
      return;
    }

    if (username === '' || password === '') return;

    logIn(username, password).then(() => {
      navigate('/', { replace: true });
    }).catch((reason) => {
      setSnackbar({ error: reason.message });
    });

  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { target: { name, value } } = event;
    const newState = { ...credential };
    switch (name) {
      case 'username':
        newState.username = value;
        setCredential(newState);
        break;
      case 'password':
        newState.password = value;
        setCredential(newState);
    }
  }

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Grid item>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form noValidate onSubmit={handleFormSubmit}>
            <TextField
              onChange={(event) => handleTextChange(event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              onChange={(event) => handleTextChange(event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            // onClick={(event)=>handleLogin(event)}
            >
              Sign In
            </Button>
          </form>

        </Grid>
      </Grid>
      <SimpleSnackbar notification={snackbar} />
    </Container>
  );
}
