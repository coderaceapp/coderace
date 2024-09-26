import '../globals.css';  // Ensure path is correct

import type { AppProps } from 'next/app';

function byteracer({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default byteracer;