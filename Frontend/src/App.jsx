import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile.jsx";
import JobseekerProflePage from "./pages/JobseekerProflePage.jsx";
import EmployerProflePage from "./pages/EmployerProflePage.jsx";
import PublicRoute from "./Routes/PublicRoute.jsx";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import UpdateJobPage from "./pages/JobUpdate.jsx";
import EmployerProfile from "./pages/EmployerEditProfile.jsx";
import JobseekerProfile from "./pages/JobseekerEditProfile.jsx";
import JobDetails from "./pages/JobAplayPage.jsx";
import SendOtp from "./pages/SendOtp.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* 404 page */}
        <Route path="*" element={<div>404 Not Found</div>} />

        {/* Public route - login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobseeker"
          element={
            // <ProtectedRoute>
              <JobseekerProflePage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/employer"
          element={
            // <ProtectedRoute>
              <EmployerProflePage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/createjob" element={<CreateJob/>}/>
        <Route path="/Updatejob/:jobId" element={<UpdateJobPage/>}/>
        <Route path="/employerprofile" element={<EmployerProfile/>}/>
        <Route path="/jobseekerprofile" element={<JobseekerProfile/>}/>
        <Route path="/job/:id" element={<JobDetails/>}/>

         
         <Route path="/sendotp" element={<SendOtp />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        
      </Routes>
    </>
  );
}

export default App;
