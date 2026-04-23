import { Navbar } from "../components/navbar";
import { GeneratedPreview } from "../components/dashboards/admin/generated-preview";
import { Tutorial } from "../components/dashboards/admin/tutorial";
import { AIForm } from "../components/dashboards/admin/ai-form";
import { CreateForm } from "../components/dashboards/admin/create-form/index";
import { CourseLibrary } from "../components/dashboards/admin/course-library";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

type AdminTab = "create" | "manual" | "library";

export default function AdminDashboard() {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("create");

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleGenerateContent = (content: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setGeneratedContent(content);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="admin-dashboard">
      <Navbar role="ADMIN" />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Title and Tabs */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Generación de contenido asistida por IA para cursos y simulaciones</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className="px-4"
            >
              Generar con IA
            </Button>
            <Button
              variant={activeTab === "manual" ? "default" : "outline"}
              onClick={() => setActiveTab("manual")}
              className="px-4"
            >
              Crear Manualmente
            </Button>
            <Button
              variant={activeTab === "library" ? "default" : "outline"}
              onClick={() => setActiveTab("library")}
              className="px-4"
            >
              Biblioteca de Cursos
            </Button>
          </div>
        </div>

        {/* Create Content Tab - AI Generation */}
        {activeTab === "create" && (
          <>
            {/* AI Form and Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIForm onGenerateContent={handleGenerateContent} />
              <GeneratedPreview content={generatedContent} setGeneratedContent={setGeneratedContent} isLoading={isLoading} />
            </div>

            {/* Tutorial Section */}
            <div>
              <Tutorial />
            </div>
          </>
        )}

        {/* Manual Creation Tab */}
        {activeTab === "manual" && (
          <CreateForm />
        )}

        {/* Library Tab */}
        {activeTab === "library" && (
          <div>
            <CourseLibrary />
          </div>
        )}
      </main>
    </div>
  );
}
