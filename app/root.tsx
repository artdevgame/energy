import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Toaster } from 'react-hot-toast';

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import { OctopusProvider } from './features/config/ConfigOctopus/octopusContext';
import styles from './styles/app.css';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Home Energy Use",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <Toaster />
        </div>
        <OctopusProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </OctopusProvider>
      </body>
    </html>
  );
}
