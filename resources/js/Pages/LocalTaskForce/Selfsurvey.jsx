import React, { useState, useEffect } from "react";
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import SelfSurveyFormTaskForce from "@/Components/SelfSurveyFormTaskForce";
import axios from "axios";
import { usePage } from "@inertiajs/react";

export default function AccreditationLocalTaskForce() {
    const { auth } = usePage().props;
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                if (auth?.user?.program_id) {
                    const response = await axios.get(`/areasTB?program_id=${auth.user.program_id}`);
                    setAreas(response.data);
                } else {
                    console.error("Program ID not found in user data");
                }
            } catch (error) {
                console.error("Error fetching areas:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAreas();
    }, [auth?.user?.program_id]);
    
    return (
        <TaskForceLayout>
            <div className="min-h-screen bg-gray.-50">
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-4">Loading areas...</div>
                    ) : (
                        <SelfSurveyFormTaskForce areas={areas}>
                        </SelfSurveyFormTaskForce>
                    )}
                    </div>
                </main>
            </div>
        </TaskForceLayout>
    );
}
