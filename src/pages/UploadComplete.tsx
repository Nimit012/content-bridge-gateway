
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Clock, Tag, ArrowRight, Home } from "lucide-react";

const UploadComplete = () => {
  const [uploadData, setUploadData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('uploadData');
    if (data) {
      setUploadData(JSON.parse(data));
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Complete!</h1>
          <p className="text-gray-600 text-lg">Your Articulate content has been successfully processed</p>
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
                  <p className="text-gray-900">{formatFileSize(uploadData.size)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Processing Time</p>
                  <p className="text-gray-900">2 minutes 34 seconds</p>
                </div>
                {uploadData.description && (
                  <div className="space-y-2 md:col-span-3">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{uploadData.description}</p>
                  </div>
                )}
                {uploadData.tags && (
                  <div className="space-y-2 md:col-span-3">
                    <p className="text-sm font-medium text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {uploadData.tags.split(',').map((tag: string, index: number) => (
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
            <CardDescription>What was extracted from your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">47</div>
                <div className="text-sm text-green-700">Slides Extracted</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                <div className="text-sm text-blue-700">Interactive Elements</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-purple-700">Assessments Found</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">156</div>
                <div className="text-sm text-orange-700">Media Assets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Your content is now ready for the testbench</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Content Available in Testbench</h3>
                  <p className="text-sm text-gray-600">Your content is now accessible in the testbench environment for review and testing</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Metadata Extracted</h3>
                  <p className="text-sm text-gray-600">All interactive elements, assessments, and media have been catalogued</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Ready for Testing</h3>
                  <p className="text-sm text-gray-600">Content can now be used for learner testing and analytics collection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
            <p className="text-green-700">
              Your Articulate content has been successfully uploaded and processed. 
              It's now ready for use in your testbench environment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadComplete;
