'use client'
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

export const Snapshot = ({ addItem }) => {
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    getUserMedia();
  }, []);

  const playSnapshotSound = () => {
    const sound = document.getElementById('snapshotSound') as HTMLAudioElement;
    sound.play();
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
  };

  const handleSubmit = async () => {
    triggerFlash();
    playSnapshotSound()
    let dataUrl;
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        dataUrl = canvasRef.current.toDataURL("image/jpeg");
        console.log(dataUrl)
      }
    }

    try {
      const { data } = await axios.post("/api/analyzeImage", {
        imageBase64: dataUrl,
      });
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult("Error analyzing the image");
    }
  };

  return (
    <div>
      <audio id="snapshotSound" src="/snapshot.mp4" preload="auto"></audio>
      <div className="flex flex-col justify-center">
        {flash && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 animate-flash"></div>
        )}
        <video
          className="mb-5"
          ref={videoRef}
          autoPlay
          style={{ width: "100%" }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Capture Image
        </Button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};
