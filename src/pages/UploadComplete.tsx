import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  FileText,
  Clock,
  Tag,
  ArrowRight,
  Home,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Upload, Cog } from "lucide-react";

const UploadComplete = () => {
  const [uploadData, setUploadData] = useState(null);
  const [timeDurations, setTimeDurations] = useState<number[]>([]);
  const [uploadUrl, setUploadUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("uploadData");
    const timeData = sessionStorage.getItem("timeDurations");

    // Add this to your useEffect:
    const urlData = sessionStorage.getItem("uploadUrl");
    if (urlData) {
      setUploadUrl(JSON.parse(urlData));
    }

    if (data && timeData) {
      const time1 = JSON.parse(data).s3uploadDuration;
      const timearray = JSON.parse(timeData);
      timearray.unshift(time1);
      setTimeDurations(timearray);
      console.log(" timearray:", timearray);
    }
    if (data) {
      setUploadData(JSON.parse(data));
    }
    return () => {
      sessionStorage.removeItem("timeDurations"); // Clear the timeDurations in sessionStorage
    };
  }, []);

  // Add these functions:
  const handleUrlClick = () => {
    if (uploadUrl) {
      window.open(uploadUrl, "_blank");
    }
  };

  const copyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(uploadUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
      description:
        "Extracting and modifying content from your Articulate package",
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

  const TimeDisplay = () => {
    const totalSeconds = timeDurations
      .map((time) => parseFloat(time)) // Convert strings to floats
      .reduce((total, current) => total + current, 0);

    // Convert total seconds into minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return (
      <div>
        <p className="text-sm font-medium text-gray-500">Processing Time</p>
        <p className="text-gray-900">{`${minutes} minutes ${seconds} seconds`}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Complete!
          </h1>
          <p className="text-gray-600 text-lg">
            Your Articulate content has been successfully processed
          </p>
        </div>

        {/* Content Summary */}
        {uploadData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{uploadData.name}</span>
              </CardTitle>
              <CardDescription>Content processing summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">File Name</p>
                  <p className="text-gray-900">{uploadData.file}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">File Size</p>
                  <p className="text-gray-900">
                    {formatFileSize(uploadData.size)}
                  </p>
                </div>
                <div className="space-y-2">
                  <TimeDisplay />
                  {/* <p className="text-sm font-medium text-gray-500">
                    Processing Time
                  </p>
                  <p className="text-gray-900">
                    {minutes} minute{minutes !== 1 ? "s" : ""} {seconds} second
                    {seconds !== 1 ? "s" : ""}
                  </p> */}
                </div>
                {uploadData.description && (
                  <div className="space-y-2 md:col-span-3">
                    <p className="text-sm font-medium text-gray-500">
                      Description
                    </p>
                    <p className="text-gray-900">{uploadData.description}</p>
                  </div>
                )}
                {uploadData.tags && (
                  <div className="space-y-2 md:col-span-3">
                    <p className="text-sm font-medium text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {uploadData.tags
                        .split(",")
                        .map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Results */}
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
            <CardDescription>
              What was extracted from your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">47</div>
                <div className="text-sm text-green-700">Slides Extracted</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                <div className="text-sm text-blue-700">
                  Interactive Elements
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-purple-700">Assessments Found</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  156
                </div>
                <div className="text-sm text-orange-700">Media Assets</div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {uploadUrl && (
          <Card
            className="mb-8 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={handleUrlClick}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Content Available</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="bg-white hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copySuccess ? "Copied!" : "Copy URL"}
                </Button>
              </CardTitle>
              <CardDescription className="text-blue-700">
                Click to view your processed content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Content URL:</p>
                <p className="text-blue-600 font-mono text-sm break-all hover:text-blue-800 transition-colors">
                  {uploadUrl}
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-2 text-sm text-blue-700">
                <ExternalLink className="h-4 w-4" />
                <span>Click anywhere on this card to open in new tab</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processed Steps</CardTitle>
            <CardDescription>
              Track the progress of each processed stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const timeTaken = timeDurations[index]; // Get the corresponding time for the step

                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${"bg-green-100 text-green-600"}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <h3 className={`font-medium ${"text-gray-900"}`}>
                        {step.name}
                      </h3>
                      <p className={`text-sm ${"text-gray-600"}`}>
                        {step.description}
                      </p>
                      {/* Display the time taken for each step */}
                      {timeTaken !== undefined && (
                        <p className="text-sm text-gray-500 mt-2">
                          Time taken: {timeTaken} seconds
                        </p>
                      )}
                      {/* Add the "Complete" status */}
                      <div className="mt-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Your content is now ready for the testbench
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Content Available in Testbench
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your content is now accessible in the testbench environment
                    for review and testing
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Metadata Extracted
                  </h3>
                  <p className="text-sm text-gray-600">
                    All interactive elements, assessments, and media have been
                    catalogued
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Ready for Testing
                  </h3>
                  <p className="text-sm text-gray-600">
                    Content can now be used for learner testing and analytics
                    collection
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/tools">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Upload More Content
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Success Message */}
        {/* <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
            <p className="text-green-700">
              Your Articulate content has been successfully uploaded and processed. 
              It's now ready for use in your testbench environment.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default UploadComplete;
