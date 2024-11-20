import { Link } from "@inertiajs/react";

export default function ApplicationLogo(props) {
    return (
        <Link href={route('dashboard')}>
            <img  src="/images/logo.png" className="block h-12  m-auto object-fill " alt="MinSU" />
        </Link>
    );
}
