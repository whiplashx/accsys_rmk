import React from 'react';
import InputLabel from './InputLabel'; // Adjust the import based on your folder structure
import InputError from './InputError'; // Adjust the import based on your folder structure

export default function DropdownSelect({
    id,
    name,
    label,
    value,
    options,
    onChange,
    error,
    required = false,
    className = '',
}) {
    return (
        <div className={`mt-4 ${className}`}>
            <InputLabel htmlFor={id} value={label} />

            <select
                id={id}
                name={name}
                value={value || ''}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
            >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
