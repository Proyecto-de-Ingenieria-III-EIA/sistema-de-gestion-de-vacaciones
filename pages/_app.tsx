import { imagesDictionary } from '@/lib/constants';
import { routerConfig } from '@/lib/router-config';
import { PrivateLayout } from '@/layouts/PrivateLayout';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SessionProvider } from 'next-auth/react';

const AppWrapper = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Find the current route configuration
  const currentRoute = routerConfig.find(
    (route) => route.path === router.pathname
  );

  // Wrap the component with the appropriate layout
  const getLayout = () => {
    if (!currentRoute?.isPublic) {
      return (
        <SessionProvider>
          <PrivateLayout>
            <Component {...pageProps} />
          </PrivateLayout>
        </SessionProvider>
      );
    }
    return (
      <PublicLayout>
        <Component {...pageProps} />
      </PublicLayout>
    );
  };

  return (
    <>
      <Head>
        <title>Nombre del Sitio</title>
        <link
          rel='apple-touch-icon'
          sizes='192x192'
          href={imagesDictionary?.favicons?.appleTouchIcon}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href={imagesDictionary?.favicons?.favicon32x32}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href={imagesDictionary?.favicons?.favicon16x16}
        />
        <link rel='manifest' href='/public/config/site.webmanifest' />
        <link
          rel='mask-icon'
          href={imagesDictionary?.favicons?.maskIcon}
          color='#000000'
        />
        <meta name='msapplication-TitleColor' content='' />
        <meta name='theme-color' content='#000000' />
        <meta
          name='title'
          content={`${pageProps?.page?.name} PortalAliados `}
        />
        <meta name='description' content='' />
        <meta
          property='og:type'
          content={`${pageProps?.page?.name} PortalAliados`}
        />
        <meta property='og:url' content='https://' />
        <meta
          property='og:title'
          content={`${pageProps?.page?.name} PortalAliados`}
        />
        <meta property='og:description' content='' />
        <meta
          property='og:image'
          content={imagesDictionary?.favicons?.ogImage}
        />
      </Head>
      {getLayout()}
    </>
  );
};

export default AppWrapper;
