"use client";

import { useState, useRef, useCallback, useEffect } from 'react'
import { CameraModal } from '@/app/video_predict/CameraModal'
import { MainContent } from '@/app/video_predict/MainContent'

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null)
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

  const requestCameraAccess = async (): Promise<boolean> => {
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
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
    }
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

  const generateAndUploadImageFile = async (imageDataUrl: string): Promise<File> => {
    imageDataUrl = imageDataUrl.split(',')[1] || imageDataUrl;
    console.log(imageDataUrl);
    const filename = 'image.jpeg';
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
      }
    }
  }, []);

  const handleSubmitForm = (formData: Record<string, unknown>) => {
    console.log("Form submitted with data:", formData);
  };

  return (
    <div className="flex h-screen bg-background text-foreground relative">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <MainContent
          selectedImage={selectedImage}
          handleRemoveImage={handleRemoveImage}
          handleImageUpload={handleImageUpload}
          openCamera={openCamera}
          cameraPermission={cameraPermission}
          handleSubmitForm={handleSubmitForm} 
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
