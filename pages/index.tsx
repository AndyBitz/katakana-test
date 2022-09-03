import cn from 'classnames';
import { FormEvent, useCallback, useState } from 'react';
import { Layout } from '../components/layout';
import { Link } from '../components/link';
import { list } from '../list';

export default function Home() {    
    const item = useItem();
    const [state, setState] = useState<'correct' | 'error' | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (state === 'correct') {
            return;
        }

        const input = (event.target as unknown as HTMLInputElement[])[0] as HTMLInputElement;
        const value = input.value;

        const lowerCaseInput = value.toLowerCase();
        const isCorrect = item.item.meaning.some(w => w.toLowerCase() === lowerCaseInput);

        let timeout: number | null = null;

        if (isCorrect) {
            setState('correct');

            // @ts-ignore
            timeout = setTimeout(() => {
                input.value = '';
                setState(null);
                item.next();
                input.focus();
                setShowInfo(false);
            }, 1500) as number;
        } else {
            setState('error');
        }

        return () => {
            clearTimeout(timeout as number);
        };
    }, [item, setState, setShowInfo]);

    return (
        <Layout>
            <div className='text-center bg-rose-400 py-16'>
                <div className='text-5xl text-white'>
                    {item.item.katakana}
                </div>
            </div>

            <div className='p-4'>
                <form onSubmit={onSubmit} className={cn('mb-4', {
                    'bg-red-500': state === 'error',
                    'bg-green-500': state === 'correct',
                    'text-white': state === 'error' || state === 'correct',
                })}>
                    <div className={cn('flex border-2 border-slate-200 text-lg px-4 focus-within:border-slate-400', {})}>
                        <div className='px-2 w-6' />
                        <input
                            className={cn('text-center outline-0 bg-inherit flex-grow py-2', {
                                'placeholder:text-slate-400': state === 'error',
                                'placeholder:text-slate-200': state === 'correct',
                            })}
                            placeholder='Meaning'
                            name="meaning"
                            readOnly={state === 'correct'}
                        />
                        <button type="submit" className='px-2 w-6'>
                            &rarr;
                        </button>
                    </div>
                </form>

                <button
                    onClick={() => setShowInfo(x => !x)}
                    className='bg-slate-200 p-1 text-center min-w-full mb-2'
                >
                    Info
                </button>

                <div className={cn('bg-slate-100 px-4 py-2 min-w-full', {
                    'hidden': !showInfo
                })}>
                    <p>Rōmaji: {item.item.romaji}</p>
                    <p>Meaning: {item.item.meaning.join('; ')}</p>
                    <p>Level: {item.item.level}</p>
                </div>
            </div>

            <footer className='absolute bottom-0 left-0'>
                <div className='p-6 flex gap-6'>
                    <div>
                        Made by <Link href="https://andybitz.io/" target="_blank">Andy</Link>.
                    </div>
                    <div>
                        Add more words on <Link href="https://github.com/AndyBitz/katakana-test" target="_blank">GitHub</Link>.
                    </div>
                </div>
            </footer>
        </Layout>
    );
}

function useItem() {
    const [index, setIndex] = useState(0);

    const next = useCallback(() => {
        const rnd = Math.floor(Math.random() * list.length);
        setIndex(rnd);
    }, [setIndex]);

    const item = list[index];

    return {
        item,
        next,
    };
}
