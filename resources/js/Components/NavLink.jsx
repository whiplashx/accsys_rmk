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
                    ? 'text-gray-900 bg-gray-100 shadow-md shadow-gray-100 font-semibold'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:text-gray-800') +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </Link>

    );
}
