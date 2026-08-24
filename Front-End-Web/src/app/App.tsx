import { RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { SubscriptionProvider } from './billing/SubscriptionContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RouterProvider router={router} />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
