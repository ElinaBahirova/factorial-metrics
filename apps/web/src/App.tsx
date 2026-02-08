import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { MetricsPage } from './features/metrics/MetricsPage';
import { MetricDetailPage } from './features/metrics/MetricDetailPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MetricsPage,
});

const metricDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/metrics/$metricId',
  component: MetricDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, metricDetailRoute]);

const router = createRouter({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
