import React, { useState, useCallback, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Paper,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { registerUser } from '../../../api/api';

import './styles.css';
import DefaultInput from '../../../common/DefaultInput';
import AuthContext from '../../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const RegisterForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const inputGroup = [
    { label: 'Login', onChange: setLogin, value: login, type: 'text' },
    { label: 'Email', onChange: setEmail, value: email, type: 'email' },
    { label: 'Password', onChange: setPassword, value: password, type: 'password' },
    { label: 'Password Confirmation', onChange: setPasswordConfirmation, value: passwordConfirmation, type: 'password' },
  ];

  const registerForm = inputGroup.map(({ label, onChange, value, type }) => (
    <FormControl key={`input${label}`} variant="outlined">
      <InputLabel htmlFor="component-outlined">{label}</InputLabel>
      <DefaultInput onChange={onChange} value={value} label={label} type={type} />
    </FormControl>
  ));

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    const isValid = email
      && login
      && password
      && passwordConfirmation
      && password === passwordConfirmation;

    if (isValid) {
      try {
        const { data: user } = await registerUser(login, email, password);
        dispatch({
          type: 'LOGIN',
          payload: user,
        });
        history.push('/');
      } catch (error) {
        setErrorMessage(error.response.data.reason);
      }
    } else {
      setErrorMessage('invalid');
    }
  }, [email, login, password, passwordConfirmation]);

  return (
    <Paper elevation={3} className="formBox">
      <form className={classes.root} onSubmit={handleRegister}>
        <Typography gutterBottom variant="h5" component="h2">
          Register
        </Typography>
        {registerForm}
        <Button variant="contained" color="primary" type="submit">
          Register
        </Button>
        <Link to="/login" className="signUpLink">
          <Button variant="contained" color="primary" className="signUpButton">
            Already have an account? Sign In
          </Button>
        </Link>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </form>
    </Paper>
  );
};

export default RegisterForm;
