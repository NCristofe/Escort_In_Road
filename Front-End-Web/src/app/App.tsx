import { RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { SubscriptionProvider } from './billing/SubscriptionContext';
import { SettingsProvider } from './settings/SettingsContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
