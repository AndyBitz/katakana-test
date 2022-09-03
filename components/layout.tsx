import { ReactNode } from 'react';
import Head from 'next/head';
import { Footer } from './footer';

export function Layout({
	title,
	children,
}: {
	title?: string;
	children: ReactNode;
}) {
	return (
		<main className='flex flex-col h-screen justify-between'>
			<Head>
				<title>{title || 'Katakana Test'}</title>
				<link rel="icon" type="image/png" href="/ka-icon.png?v=1" />
			</Head>

			<div>
				{children}
			</div>

			<Footer />
		</main>
	);
}
