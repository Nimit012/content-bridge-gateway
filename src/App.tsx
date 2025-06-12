
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ToolSelection from "./pages/ToolSelection";
import ArticulateUpload from "./pages/ArticulateUpload";
import ProcessingStatus from "./pages/ProcessingStatus";
import UploadComplete from "./pages/UploadComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools" element={<ToolSelection />} />
          <Route path="/articulate" element={<ArticulateUpload />} />
          <Route path="/processing" element={<ProcessingStatus />} />
          <Route path="/complete" element={<UploadComplete />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
