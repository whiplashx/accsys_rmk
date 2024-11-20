import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-3 py-2 text-sm font-medium leading-5 transition-all duration-150 ease-in-out focus:outline-none rounded-lg ' +
                (active
                    ? 'text-green-900 bg-green-100 shadow-md shadow-green-100 font-semibold'
                    : 'text-gray-600 hover:text-green-800 hover:bg-green-50 focus:text-green-800') +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </Link>

    );
}
