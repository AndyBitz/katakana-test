import cn from 'classnames';
import { AnchorHTMLAttributes } from 'react';

export function Link({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a className={cn('text-blue-300 hover:underline', className)} {...props}>
            {children}
        </a>
    );
}
