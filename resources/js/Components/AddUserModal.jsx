import React, { useEffect, useState } from "react";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import DropdownSelect from "./DropdownSelect";
import PrimaryButton from "./PrimaryButton";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-toastify';
import axios from 'axios';

function AddUserModal({ show, handleClose, onSuccess }) {
    const [departmentsTB, setDepartments] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        departments: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (show) {
            fetchDepartments();
        }
    }, [show]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departmentsTB');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                reset('password', 'password_confirmation');
                handleClose();
                toast.success('User added successfully!');
                onSuccess(page.props.flash.success);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to add user. Please check the form and try again.');
            },
        });
    };


    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Add User</h3>
                    <button className="text-gray-400 hover:text-gray-600" onClick={handleClose}>
                        <span className="sr-only">Close</span>
                        ✖
                    </button>
                </div>
                <form onSubmit={submit}>
                    <div className="space-y-4">
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

                        <div>
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

                        <DropdownSelect
                            id="role"
                            name="role"
                            label="Role"
                            value={data.role}
                            options={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'localtaskforce', label: 'Task Force' },
                                { value: 'localaccreditor', label: 'Accreditor' },
                            ]}
                            onChange={(e) => setData('role', e.target.value)}
                            error={errors.role}
                        />

                        <DropdownSelect
                            id="departments"
                            name="departments"
                            label="Department"
                            value={data.departments}
                            options={departmentsTB.map(dept => ({ value: dept.id, label: `${dept.name} (${dept.code})` }))}
                            onChange={(e) => setData('departments', e.target.value)}
                            error={errors.department_id}
                        />

                        <div>
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

                        <div>
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
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;

