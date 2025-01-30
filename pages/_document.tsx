import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang='en'>
      <Head></Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
