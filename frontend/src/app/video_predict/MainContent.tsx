import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePreview } from "./ImagePreview";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

interface MainContentProps {
  selectedImage: string | null;
  handleRemoveImage: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openCamera: () => void;
  cameraPermission: PermissionState | null;
  handleSubmitForm: (formData: any) => void;
}

export function MainContent({
  selectedImage,
  handleRemoveImage,
  handleImageUpload,
  openCamera,
  cameraPermission,
  handleSubmitForm,
}: MainContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const router = useRouter()

  const handleRunAnalysis = async () => {
    if (!selectedImage) {
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
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append('file', blob, 'uploaded-image.jpg');
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
      if (error instanceof Error) {
        alert(`Prediction failed: ${error.message}`);
      } else {
        alert('Prediction failed: An unknown error occurred.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push("/")}>
                <ChevronLeft />
              </Button>
              <CardTitle>Image Preview</CardTitle>
            </div>
          </CardHeader>
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
                <ReactMarkdown className="prose">{analysisResult}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    </div>
  );
}