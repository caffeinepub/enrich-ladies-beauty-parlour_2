import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import BookAppointment from './pages/BookAppointment';
import BookingConfirmation from './pages/BookingConfirmation';
import ManageServices from './pages/ManageServices';
import ThemeCustomization from './pages/ThemeCustomization';
import OwnerReviews from './pages/OwnerReviews';
import OwnerProfile from './pages/OwnerProfile';
import OwnerAppointmentsOfDay from './pages/OwnerAppointmentsOfDay';
import CustomerReviews from './pages/CustomerReviews';
import CustomerProfile from './pages/CustomerProfile';
import OurServices from './pages/OurServices';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  ),
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const ownerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner-dashboard',
  component: OwnerDashboard,
});

const ownerAppointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/appointments',
  component: OwnerAppointmentsOfDay,
});

const manageServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/manage-services',
  component: ManageServices,
});

const themeCustomizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/theme-customization',
  component: ThemeCustomization,
});

const ownerReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/reviews',
  component: OwnerReviews,
});

const ownerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/profile',
  component: OwnerProfile,
});

const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-dashboard',
  component: CustomerDashboard,
});

const bookAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book-appointment',
  component: BookAppointment,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking-confirmation',
  component: BookingConfirmation,
});

const customerReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/reviews',
  component: CustomerReviews,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/profile',
  component: CustomerProfile,
});

const ourServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/services',
  component: OurServices,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  loginRoute,
  ownerDashboardRoute,
  ownerAppointmentsRoute,
  manageServicesRoute,
  themeCustomizationRoute,
  ownerReviewsRoute,
  ownerProfileRoute,
  customerDashboardRoute,
  bookAppointmentRoute,
  bookingConfirmationRoute,
  customerReviewsRoute,
  customerProfileRoute,
  ourServicesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
