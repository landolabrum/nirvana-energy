import React from 'react';

import Head from "next/head";
import type { AppProps } from "next/app";
import MainLayout from "../layouts/default/DefaultLayout";
import ServiceContainer from "@webstack/components/ServiceContainer/ServiceContainer";
import styles from "~/src/layouts/default/DefaultLayout.scss"
import { OverlayProvider } from "@webstack/components/Overlay/Overlay";
import { HeaderProvider } from "@webstack/components/Header/controller/Header";
import { NotificationProvider } from "@webstack/components/Notification/Notification";
import { ModalProvider } from "@webstack/components/modal/contexts/modalContext";
import { ModalOverlay } from "@webstack/components/modal/views/modalOverlay";
import { LoaderProvider } from "@webstack/components/Loader/Loader";


// import { appWithTranslation } from 'next-i18next';


const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
  
      </Head>
      <style jsx>{styles}</style>
                <ServiceContainer />
      <OverlayProvider>
        <LoaderProvider>
          <NotificationProvider>
            <ModalProvider>
              <HeaderProvider>
                <ModalOverlay />
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </HeaderProvider>
            </ModalProvider>
          </NotificationProvider>
        </LoaderProvider>
      </OverlayProvider>
    </>
  );
}

export default MyApp;
//export default  appWithTranslation(MyApp)
