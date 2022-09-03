import cn from 'classnames';
import levensheitn from 'fast-levenshtein';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from '../components/layout';
import { list } from '../data/list';

export default function Home() {
	const item = useItem();
	const [state, setState] = useState<'correct' | 'error' | null>(null);
	const [showInfo, setShowInfo] = useState(false);
	const [isOff, setIsOff] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const input = (
				event.target as unknown as HTMLInputElement[]
			)[0] as HTMLInputElement;

			if (state === 'correct') {
				setState(null);
				setShowInfo(false);
				setIsOff(false);
				input.focus();
				input.value = '';
				item.next();
				return;
			}

			const value = input.value.trim();
			if (!value) {
				return;
			}

			const lowerValue = value.toLowerCase();
			const [distance] = item.item.meaning.map(
				(w) => levensheitn.get(w.toLowerCase(), lowerValue)
			).sort();

			if (distance < 2) {
				setState('correct');
				if (distance > 0) {
					setIsOff(true);
				}
			} else {
				setState('error');
			}
		},
		[item, setState, setShowInfo, setIsOff]
	);

	return (
		<Layout>
			<div className="text-center bg-rose-400 py-16">
				<div className="text-5xl text-white">
					{item.isReady ? item.item.katakana : <>&nbsp;</>}
				</div>
			</div>

			<div className="p-4">
				<form
					onSubmit={onSubmit}
					className={cn('mb-4', {
						'bg-red-500': state === 'error',
						'bg-green-600': state === 'correct',
						'text-white': state === 'error' || state === 'correct',
					})}
				>
					<div
						className={cn(
							'flex border-2 border-slate-200 text-lg px-4', {
								'border-red-500': state === 'error',
								'border-green-600': state === 'correct',
							}
						)}
					>
						<div className="px-2 w-6" />
						<input
							ref={inputRef}
							className={cn(
								'text-center outline-0 bg-inherit flex-grow py-2 font-normal',
								{
									'placeholder:text-slate-400':
										state === 'error',
									'placeholder:text-slate-200':
										state === 'correct',
								}
							)}
							placeholder="Meaning"
							name="meaning"
							readOnly={state === 'correct'}
						/>
						<button type="submit" className="px-2 w-6">
							&rarr;
						</button>
					</div>
				</form>

				{isOff ? (
					<div className='text-center pb-4 text-sm'>
						Your answer was slightly off.
					</div>
				) : null}

				<button
					onClick={() => {
						setShowInfo((x) => !x);
						inputRef?.current?.focus();
					}}
					className="bg-slate-200 p-1 text-center min-w-full mb-2"
				>
					Info
				</button>

				<div
					className={cn('bg-slate-100 px-4 py-2 min-w-full', {
						invisible: !showInfo,
					})}
				>
					<p>Meaning: {item.item.meaning.join('; ')}</p>
					<p>Rōmaji: {item.item.romaji}</p>
					<p>Level: {item.item.level}</p>
				</div>
			</div>
		</Layout>
	);
}

function useItem() {
	const [index, setIndex] = useState(0);
	const [ready, setReady] = useState(false);

	const next = useCallback(() => {
		setIndex(Math.floor(Math.random() * list.length));
	}, [setIndex]);

	const item = list[index];

	// Start with a random word.
	useEffect(() => {
		next();
		setReady(true);
	}, [next, setReady]);

	return {
		item,
		next,
		isReady: ready,
	};
}
