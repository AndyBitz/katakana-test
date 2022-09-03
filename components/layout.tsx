import { ReactNode } from 'react';
import Head from 'next/head';

export function Layout({
    title,
    children
}: {
    title?: string;
    children: ReactNode;
}) {
    return (
        <main>
            <Head>
                <title>{title || 'Katakana Test'}</title>
                <link rel="icon" type="image/png" href="/ka-icon.png?v=1" />
            </Head>
            {children}
        </main>
    );
}
