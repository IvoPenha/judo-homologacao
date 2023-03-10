import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';

import { useAuthContext } from '../hooks/useAuthProvider';
import { useAlertContext } from '../hooks/useAlertProvider';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signIn } = useAuthContext();
  const { emitAlertMessage } = useAlertContext();

  const formik = useFormik({
    initialValues: {
      email: 'ivo@email.com',
      senha: '29042001',
    },
    validationSchema: yup.object().shape({
      email: yup.string()
        .email('Email inválido')
        .required('Campo obrigatório'),
      senha: yup.string()
        .required('Campo obrigatório'),
    }),
    onSubmit: async (values) => {
      const isSuccess = await signIn(values);
      if (!isSuccess) {
        return emitAlertMessage('error', 'Usuário ou senha inválidos, tente novamente.');
      }
      navigate('/', { replace: true });
    }
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: '100vh',
        backgroundColor: '#FFFF',
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h4" component="h1" gutterBottom>
            Entrar
          </Typography>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Usuario *"
            value={formik.values["email"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["email"] && Boolean(formik.errors["email"])}
            helperText={formik.touched["email"] && formik.errors["email"]}
            margin="normal"
            variant="outlined"
            type="email"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="senha"
            name="senha"
            label="Senha *"
            value={formik.values["senha"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["senha"] && Boolean(formik.errors["senha"])}
            helperText={formik.touched["senha"] && formik.errors["senha"]}
            margin="normal"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {/* <InputField
            formik={formik}
            id="login-textfield-email"
            name="email"
            label="Usuario *"
            type="email"
            sx={{ mb: 2 }}
          />
          <InputField
            formik={formik}
            id="login-textfield-password"
            name="password"
            label="Senha *"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          /> */}
          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
        </form>
      </Container>
    </Box>
  );
}