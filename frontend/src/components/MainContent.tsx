import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ImagePreview } from "./ImagePreview";

interface MainContentProps {
  analysisMode: "Image Analysis" | "Manual";
  selectedImage: string | null;
  handleRemoveImage: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openCamera: () => void;
  cameraPermission: PermissionState | null;
  markdownAnalysis: string;
  handleSubmitForm: (formData: any) => void;
}

export function MainContent({
  analysisMode,
  selectedImage,
  handleRemoveImage,
  handleImageUpload,
  openCamera,
  cameraPermission,
  markdownAnalysis,
  handleSubmitForm,
}: MainContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (analysisMode === "Image Analysis" && !selectedImage) {
      alert("Please upload or capture an image first.");
      return;
    }
  
    setIsLoading(true);
    setShowAnalysis(false);
    setAnalysisResult(null);
  
    try {
      const formData = new FormData();
  
      if (selectedImage) {
        if (selectedImage.startsWith('data:image')) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append('file', blob, 'uploaded-image.jpg');
        } else {
          formData.append('file', selectedImage, 'uploaded-image.jpg');
        }
      }
  
      const response = await fetch('http://127.0.0.1:8000/process-image/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Prediction response:', data);
      
      // Set analysis result and show analysis
      setAnalysisResult(data.result);
      handleSubmitForm(data);
  
      setIsLoading(false);
      setShowAnalysis(true);
  
    } catch (error) {
      console.error('Full Prediction Error:', error);
      setIsLoading(false);
      alert(`Prediction failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {analysisMode === "Image Analysis" ? (
        <>
          <Card>
            <CardHeader><CardTitle>Image Preview</CardTitle></CardHeader>
            <CardContent>
              <ImagePreview
                selectedImage={selectedImage}
                onImageRemove={handleRemoveImage}
                onImageUpload={handleImageUpload}
                openCamera={openCamera}
                cameraPermission={cameraPermission}
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Analyzing..." : "Run Analysis"}
          </Button>

          {showAnalysis && analysisResult && (
            <Card>
              <CardHeader><CardTitle>Analysis Result</CardTitle></CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardHeader><CardTitle>Ingredient Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {/* Existing input fields */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}