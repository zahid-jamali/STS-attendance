import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import Header from "./components/Header";
import Index from "./components/Index";
import Home from "./components/Home";
import Myprojects from "./components/Myprojects";
import Notifications from "./components/Notification";
import Attendance from "./components/Attendance";
import ManageMyProfile from "./components/ManageMyProfile";
import Learnings from "./components/Learnings";
import Complains from "./components/Complains";
import Leaves from "./components/Leaves";

const App=()=>{
  return (<>
    {/* <Index /> */}
    
    <BrowserRouter >
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/login" element={<Index />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/myprojects" element={<Myprojects />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/manage-my-profile" element={<ManageMyProfile />} />
        <Route path="/learnings" element={<Learnings />} />
        <Route path="/complains-and-suggestions" element={<Complains />} />
        <Route path="/leaves" element={<Leaves />} />

      </Routes>
    </BrowserRouter>
  </>)
}
export default App;