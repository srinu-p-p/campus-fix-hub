import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import IssueDetail from "./pages/IssueDetail";
import AdminOverview from "./pages/AdminOverview";
import AdminIssues from "./pages/AdminIssues";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminDepartments from "./pages/AdminDepartments";
import LostFound from "./pages/LostFound";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/issues" element={<AdminIssues />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
