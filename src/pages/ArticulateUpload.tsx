import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileArchive, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setSocket } from "../lib/socket";

const ArticulateUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
        if (!formData.name) {
          setFormData((prev) => ({
            ...prev,
            name: file.name.replace(".zip", ""),
          }));
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a .zip file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
        if (!formData.name) {
          setFormData((prev) => ({
            ...prev,
            name: file.name.replace(".zip", ""),
          }));
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a .zip file",
          variant: "destructive",
        });
      }
    }
  };

  // Request a presigned S3 upload URL from backend
  async function getPresignedUrl(file: File) {
    const contentType = encodeURIComponent(file.type || "application/zip");
    const url = `https://m169po56wj.execute-api.us-east-1.amazonaws.com/dev/presigned-url?contentType=${contentType}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to get presigned URL: ");
    }
    return data;
  }

  // Upload file to S3 using presigned URL
  async function uploadFileToS3(uploadUrl: string, file: File) {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/zip",
      },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    } else {
      console.log("File uploaded successfully");
    }
  }

  useEffect(() => {
    // const socket = getSocket();
    // socket.onopen = () =>
    //   console.log("Connection opened from Page ArticulateUpload");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a .zip file to upload",
        variant: "destructive",
      });
      return;
    }
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your content",
        variant: "destructive",
      });
      return;
    }



    // Store upload data in sessionStorage for the processing page
    sessionStorage.setItem(
      "uploadData",
      JSON.stringify({
        file: selectedFile.name,
        size: selectedFile.size,
        ...formData,
      })
    );

    navigate("/processing");

    // fire-and-forget upload
    (async () => {
      try {
        const { uploadId, uploadUrl } = await getPresignedUrl(selectedFile);
        console.log("Presigned URL:", uploadUrl);
        const startTime = Date.now(); // Start timing





        const socket = setSocket(uploadId);
        socket.onopen = () =>
          console.log("Connection opened from Page ArticulateUpload");




        await uploadFileToS3(uploadUrl, selectedFile);

        const endTime = Date.now(); // End timing
        const durationMs = endTime - startTime;
        const durationSeconds = (durationMs / 1000).toFixed(2);
        console.log(" durationSeconds:", durationSeconds);

        sessionStorage.setItem(
          "uploadData",
          JSON.stringify({
            file: selectedFile.name,
            size: selectedFile.size,
            ...formData,
            s3uploadDuration: durationSeconds, // Add the duration to the stored data
          })
        );
  

      } catch (err) {
        console.error("Background upload failed:", err);
        toast({
          title: "Upload failed",
          description: err.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    })();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/tools"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tool Selection
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Articulate Package
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your Articulate Storyline .zip package for processing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileArchive className="h-5 w-5" />
                <span>Select Package File</span>
              </CardTitle>
              <CardDescription>
                Upload your Articulate Storyline package (.zip file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileArchive className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="text-lg font-medium text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your .zip file here
                      </p>
                      <p className="text-gray-500">or click to browse</p>
                    </div>
                    <Button type="button" variant="outline">
                      Choose File
                    </Button>
                  </div>
                )}

                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata Form */}
          <Card>
            <CardHeader>
              <CardTitle>Content Information</CardTitle>
              <CardDescription>
                Provide additional details about your content package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Content Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter a descriptive name for your content"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this content covers..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="e.g., training, assessment, beginner (comma separated)"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-orange-900 mb-1">
                    Before you upload
                  </h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>
                      • Ensure your package is a valid Articulate Storyline .zip
                      file
                    </li>
                    <li>
                      • Processing typically takes 2-5 minutes depending on
                      package size
                    </li>
                    <li>
                      • You'll be able to monitor the progress in real-time
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link to="/tools">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={!selectedFile || !formData.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Start Upload & Processing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticulateUpload;
