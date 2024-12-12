import React from "react";
import SelfSurveyForm from "@/Components/SelfSurveyForm";
import AccreditationLayout from "@/Layouts/AccreditorLayout";

export default function Documentation(){
    return(
        <AccreditationLayout>
                <div className="min-h-screen bg-gray.-50">

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <SelfSurveyForm></SelfSurveyForm>
        </div>
      </main>
      </div>
        </AccreditationLayout>
    );
}