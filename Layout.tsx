import { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'Canawide - Connect with Blue-Collar Jobs' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Connect with blue-collar job opportunities across Canada" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main-container d-flex flex-column min-vh-100">
        <Header />
        <main className="page-content flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}