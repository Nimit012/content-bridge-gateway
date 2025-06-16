import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, Cog, FileText, Clock } from "lucide-react";
import { getSocket } from "../lib/socket";

const ProcessingStatus = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadData, setUploadData] = useState(null);
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      label: "in upload processing lambda",
      name: "Uploading file",
      description: "Transferring your package to our servers",
      icon: Upload,
    },
    {
      id: 2,
      label: "in content processing lambda",
      name: "Analyzing content",
      description: "analyzing your Articulate package",
      icon: FileText,
    },
    {
      id: 3,
      label: "zip extracted and successfully processed",
      name: "Extracting content",
      description: "Extracting and modifying content from your Articulate package",
      icon: Cog,
    },
    {
      id: 4,
      label: "in step3 lambda",
      name: "Finalizing",
      description: "Preparing your content for the testbench",
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    const socket = getSocket();

    const data = sessionStorage.getItem("uploadData");
    if (data) {
      setUploadData(JSON.parse(data));
    } else {
      navigate("/articulate");
      return;
    }

    // WebSocket connection
    socket.onmessage = (event) => {
      const message = event.data; // Just the string like "step1", "step2", etc.
      console.log("WebSocket message received: ", message);
      webSocketMessageHandler(message);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    const webSocketMessageHandler = (message) => {
      // Only process the event if 1 second has passed since the last update
      const matched = steps.find((s) =>
        message.toLowerCase().includes(s.label.toLowerCase())
      );

      if (matched) {
        const next = matched.id + 1;

        // Delay the update of the current step by 1 second
        // Clamp so we never go past the last step
        setCurrentStep(next <= steps.length ? next : steps.length);

        // If it was the last step, go to /complete
        if (matched.id === steps.length) {
          setTimeout(() => {
            setProgress((matched.id / steps.length) * 100);
            navigate("/complete");
          }, 1500);
        } else {
          setProgress((matched.id / steps.length) * 100);
        }
      }
    };
  }, [navigate, currentStep]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!uploadData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Processing Your Content
          </h1>
          <p className="text-gray-600 text-lg">
            Please wait while we process your Articulate package
          </p>
        </div>

        {/* File Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{uploadData.name}</span>
            </CardTitle>
            <CardDescription>
              {uploadData.file} • {formatFileSize(uploadData.size)}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processing Progress</CardTitle>
            <CardDescription>
              {progress < 100
                ? "Your content is being processed..."
                : "Processing complete!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {progress}% Complete
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    Estimated time:{" "}
                    {progress < 100 ? "2-3 minutes" : "Complete"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Steps</CardTitle>
            <CardDescription>
              Track the progress of each processing stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isPending = currentStep < step.id;

                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : isActive
                          ? "bg-blue-100 text-blue-600 animate-pulse"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <h3
                        className={`font-medium ${
                          isCompleted || isActive
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isCompleted || isActive
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                      {isActive && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          <span className="text-sm text-blue-600 font-medium">
                            In progress...
                          </span>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mt-2 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            Complete
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  Please keep this page open
                </h3>
                <p className="text-sm text-blue-700">
                  Processing is in progress. Closing this page won't affect the
                  upload, but you'll lose the ability to monitor progress in
                  real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessingStatus;
