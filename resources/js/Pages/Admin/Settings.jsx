import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AdminSettingsPage from "./Setting";

export default function departments(){
    return(
        <AdminLayout>
            <AdminSettingsPage></AdminSettingsPage>
        </AdminLayout>
    );
}