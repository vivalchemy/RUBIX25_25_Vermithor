import { useState, useRef, useCallback, useEffect } from 'react'
import { CameraModal } from '@/components/CameraModal'
import { Header } from '@/components/Headers'
import { MainContent } from '@/components/MainContent'

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [markdownAnalysis, setMarkdownAnalysis] = useState("")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null)
  const [analysisMode, setAnalysisMode] = useState<'Image Analysis' | 'Manual'>('Image Analysis')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    checkCameraPermission()
  }, [])

  const checkCameraPermission = async () => {
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setCameraPermission(permission.state)
      permission.onchange = () => setCameraPermission(permission.state)
    }
  }

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
      return true
    } catch (error) {
      console.error('Error requesting camera access:', error)
      setCameraPermission('denied')
      return false
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file); // Read file as data URL for preview

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://192.168.29.35:8000/quality/', { 
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Upload successful:', result.file_text);
          setMarkdownAnalysis(result.file_text);
        } else {
          console.error('Upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error while uploading image:', error);
      }
    };
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
  }

  const openCamera = async () => {
    if (cameraPermission !== 'granted') {
      const granted = await requestCameraAccess()
      if (!granted) {
        alert("Camera access is required to use this feature. Please grant permission and try again.")
        return
      }
    }

    setIsCameraOpen(true)
    try {
      const constraints = {
        video: {
          facingMode: 'environment'
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
      alert("Failed to access the camera. Please make sure you've granted the necessary permissions.")
    }
  }

  const generateAndUploadImageFile = async (imageDataUrl: string) => {
    imageDataUrl = imageDataUrl.split(',')[1] || imageDataUrl;
    console.log(imageDataUrl);
    let filename = 'image.jpeg';
    const binaryData = atob(imageDataUrl);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

    return new File([blob], filename, { type: 'image/jpeg' });
  };

  const captureImage = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        setIsCameraOpen(false);

        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());

        const imageFile = await generateAndUploadImageFile(imageDataUrl);
        console.log(imageFile);

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
          const response = await fetch('http://192.168.29.35:8000/quality/', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Upload successful:', result.file_text);
            setMarkdownAnalysis(result.file_text);
          } else {
            console.error('Upload failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error while uploading image:', error);
        }
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground relative">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <Header
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          analysisMode={analysisMode}
          handleDropdownChange={(mode) => { 
            setAnalysisMode(mode === "Image Analysis" ? "Image Analysis" : "Manual") 
          }}
        />
        <MainContent
          analysisMode={analysisMode}
          selectedImage={selectedImage}
          handleRemoveImage={handleRemoveImage}
          handleImageUpload={handleImageUpload}
          openCamera={openCamera}
          cameraPermission={cameraPermission}
          markdownAnalysis={markdownAnalysis}
        />
      </div>

      <CameraModal
        isCameraOpen={isCameraOpen}
        onOpenChange={setIsCameraOpen}
        captureImage={captureImage}
        videoRef={videoRef}
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
