import cn from 'classnames';
import levensheitn from 'fast-levenshtein';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

			if (!item.item) {
				return;
			}

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
			<div className="relative text-center bg-rose-400 py-16">
				<div className="text-5xl text-white">
					{item.item ? item.item.katakana : <>&nbsp;</>}
				</div>

				<div className='absolute top-4 right-4 text-sm text-white'>
					{item.index + 1} / {item.total}
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
					{item.item ? (
						<>
							<p>Meaning: {item.item.meaning.join('; ')}</p>
							<p>Rōmaji: {item.item.romaji}</p>
							<p>Level: {item.item.level}</p>
						</>
					) : null}
				</div>
			</div>
		</Layout>
	);
}

function generateList() {
	const copy = JSON.parse(JSON.stringify(list)) as typeof list;

	// Shuffle the list so that each list will be random.
	for (let i = 0; i < copy.length; i++) {
		const rnd = Math.floor(Math.random() * copy.length);
		const tmp = copy[i];
		copy[i] = copy[rnd];
		copy[rnd] = tmp;
	}

	return copy;
}

function useItem() {
	const list = useMemo(() => generateList(), []);

	const [index, setIndex] = useState(0);
	const [ready, setReady] = useState(false);

	const next = useCallback(() => {
		setIndex((curr) => {
			const inc = curr + 1;
			return inc % list.length;
		});
	}, [list, setIndex]);

	// Since we start with a random word,
	// the server and client render will be different
	// so avoid rendering while not ready.
	useEffect(() => {
		setReady(true);
	}, [next, setReady]);

	const item = ready ? list[index] : null;

	return {
		index,
		total: list.length,
		item,
		next,
		isReady: ready,
	};
}
