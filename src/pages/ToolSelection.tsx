
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, FileText, Brain, Puzzle } from "lucide-react";

const ToolSelection = () => {
  const tools = [
    {
      id: "articulate",
      name: "Articulate Storyline",
      description: "Upload and process Articulate Storyline packages (.zip)",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      available: true,
      route: "/articulate"
    },
    {
      id: "google-docs",
      name: "Google Docs",
      description: "Import content directly from Google Documents",
      icon: FileText,
      color: "from-green-500 to-green-600",
      available: false,
      route: "#"
    },
    {
      id: "quizlet",
      name: "Quizlet",
      description: "Import study sets and flashcards from Quizlet",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      available: false,
      route: "#"
    },
    {
      id: "h5p",
      name: "H5P Interactive Content",
      description: "Upload and process H5P interactive content packages",
      icon: Puzzle,
      color: "from-orange-500 to-orange-600",
      available: false,
      route: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Select Content Source</h1>
          <p className="text-gray-600 text-lg">Choose the third-party tool you want to import content from</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${tool.available ? 'hover:scale-105' : 'opacity-75'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5`}></div>
              <CardHeader className="relative">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    {!tool.available && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 mb-6">{tool.description}</CardDescription>
                {tool.available ? (
                  <Link to={tool.route}>
                    <Button className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-opacity`}>
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Need help with your content format?</h3>
                <p className="text-blue-700 text-sm">
                  Each tool has specific requirements for content packages. Make sure your files are properly formatted 
                  and packaged according to the tool's specifications for the best upload experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolSelection;
