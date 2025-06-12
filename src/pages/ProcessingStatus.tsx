
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, Cog, FileText, Clock } from "lucide-react";

const ProcessingStatus = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadData, setUploadData] = useState<any>(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: "Uploading file", description: "Transferring your package to our servers", icon: Upload },
    { id: 2, name: "Extracting content", description: "Unpacking and analyzing your Articulate package", icon: FileText },
    { id: 3, name: "Processing content", description: "Converting and optimizing your content", icon: Cog },
    { id: 4, name: "Finalizing", description: "Preparing your content for the testbench", icon: CheckCircle },
  ];

  useEffect(() => {
    // Get upload data from sessionStorage
    const data = sessionStorage.getItem('uploadData');
    if (data) {
      setUploadData(JSON.parse(data));
    } else {
      // Redirect if no upload data
      navigate('/articulate');
      return;
    }

    // Simulate processing steps
    const intervals: NodeJS.Timeout[] = [];
    
    // Step 1: Upload (0-25%)
    const step1 = setInterval(() => {
      setProgress(prev => {
        if (prev >= 25) {
          clearInterval(step1);
          setCurrentStep(1);
          return 25;
        }
        return prev + 2;
      });
    }, 150);
    intervals.push(step1);

    // Step 2: Extract (25-50%)
    setTimeout(() => {
      const step2 = setInterval(() => {
        setProgress(prev => {
          if (prev >= 50) {
            clearInterval(step2);
            setCurrentStep(2);
            return 50;
          }
          return prev + 1.5;
        });
      }, 200);
      intervals.push(step2);
    }, 4000);

    // Step 3: Process (50-85%)
    setTimeout(() => {
      const step3 = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(step3);
            setCurrentStep(3);
            return 85;
          }
          return prev + 1;
        });
      }, 8000);
      intervals.push(step3);
    }, 300);

    // Step 4: Finalize (85-100%)
    setTimeout(() => {
      const step4 = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(step4);
            setCurrentStep(4);
            // Navigate to completion page after a brief delay
            setTimeout(() => navigate('/complete'), 1500);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
      intervals.push(step4);
    }, 12000);

    // Cleanup intervals on unmount
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [navigate]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!uploadData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Processing Your Content</h1>
          <p className="text-gray-600 text-lg">Please wait while we process your Articulate package</p>
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
              {progress < 100 ? 'Your content is being processed...' : 'Processing complete!'}
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
                  <span>Estimated time: {progress < 100 ? '2-3 minutes' : 'Complete'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Steps</CardTitle>
            <CardDescription>Track the progress of each processing stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                const isPending = currentStep < index;

                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isActive 
                        ? 'bg-blue-100 text-blue-600 animate-pulse' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <h3 className={`font-medium ${
                        isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </h3>
                      <p className={`text-sm ${
                        isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {isActive && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          <span className="text-sm text-blue-600 font-medium">In progress...</span>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mt-2 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Please keep this page open</h3>
                <p className="text-sm text-blue-700">
                  Processing is in progress. Closing this page won't affect the upload, but you'll lose 
                  the ability to monitor progress in real-time.
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
