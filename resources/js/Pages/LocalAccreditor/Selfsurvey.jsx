import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelfSurveyForm from '@/Components/SelfSurveyForm';
import { Head } from '@inertiajs/react';
import SelfSurveyFormAccreditor from '@/Components/SelfSurveyFormAccreditor';

export default function Selfsurvey({ auth }) {
    return (
        <AccreditorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Self-Survey Form</h2>}
        >
            <Head title="Self-Survey" />
            <SelfSurveyFormAccreditor />
        </AccreditorLayout>
    );
}