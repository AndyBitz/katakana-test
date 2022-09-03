import { Link } from './link';

export function Footer() {
	return (
		<footer className="">
			<div className="p-6 flex gap-6">
				<div>
					Made by{' '}
					<Link href="https://andybitz.io/" target="_blank">
						Andy
					</Link>
					.
				</div>
				<div>
					Add more words on{' '}
					<Link
						href="https://github.com/AndyBitz/katakana-test"
						target="_blank"
					>
						GitHub
					</Link>
					.
				</div>
			</div>
		</footer>
	);
}
