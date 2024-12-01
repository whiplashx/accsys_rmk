import React from "react";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import DropdownSelect from "./DropdownSelect";
import PrimaryButton from "./PrimaryButton";
import { useForm } from "@inertiajs/react";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddUserModal({ show, handleClose, onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });


    
    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                reset('password', 'password_confirmation');
                handleClose();
                notify(); // Trigger the toast notification
                onSuccess(page.props.flash.success);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    if (!show) return null;

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Add User</h3>
                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            ✖
                        </button>
                    </div>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <DropdownSelect
                                id="role"
                                name="role"
                                label="Role"
                                value={data.role}
                                options={[
                                    { value: 'Admin', label: 'Admin' },
                                    { value: 'Task Force', label: 'Task Force' },
                                    { value: 'Accreditor', label: 'Accreditor' },
                                ]}
                                onChange={(e) => setData('role', e.target.value)}
                                error={errors.role}
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
}

export default AddUserModal;

