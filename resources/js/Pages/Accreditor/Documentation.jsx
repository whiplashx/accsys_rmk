import React from "react";
import SelfSurveyForm from "@/Components/SelfSurveyForm";
import AccreditationLayout from "@/Layouts/AccreditorLayout";
import Documentation_ from "@/Components/Documentation";
import AccreditationChatbot from "@/Components/AccreditationChatbot";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function Documentation(){
    return(
        <AccreditationLayout>
                <div className="min-h-screen bg-gray.-50">
      <Breadcrumbs></Breadcrumbs>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Documentation_>
            
          </Documentation_>
          <AccreditationChatbot></AccreditationChatbot>
        </div>
      </main>
      </div>
        </AccreditationLayout>
    );
}