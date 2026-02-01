import React from 'react';

import { GlobalStyle } from '../styles/globalStyles';
import CacheManager from '../components/CacheManager';

const metaDescription = '웨딩 청첩장 - 찬빈 ❤️ 인화';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <link rel="preload" href="/fonts/PlayfairDisplay-Italic.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
                <link rel="preload" href="/fonts/MaruBuri-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
                <meta name="description" content={metaDescription} />
            </head>
            <body>
                <GlobalStyle />
                <CacheManager />
                {children}
            </body>
        </html>
    );
}
