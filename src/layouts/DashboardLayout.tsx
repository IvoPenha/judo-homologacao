import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { styled } from '@mui/material/styles';

import { Header } from './header';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  overflowX: 'hidden',
  paddingBottom: theme.spacing(0),
  [theme.breakpoints.up('lg')]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2),
  },
}));

export function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Main>
        <Header />
        <Outlet />
      </Main>
    </StyledRoot>
  );
}