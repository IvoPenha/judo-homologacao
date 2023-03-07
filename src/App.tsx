import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import Router from './Routes';
import { AuthProvider } from './providers/context/AuthContext';
import { ModalProvider } from './providers/context/ModalContext';
import { AlertProvider } from './providers/context/AlertContext';
import { FormikProvider } from './providers/context/FormikContext';

import { AlertComponent } from './components/Alert';

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <FormikProvider>
          <AlertProvider>
            <ModalProvider>
              <AlertComponent />
              <Router />
            </ModalProvider>
          </AlertProvider>
        </FormikProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}