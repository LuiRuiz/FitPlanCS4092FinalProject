import FitNavbar from "./components/Navbar";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>

      <FitNavbar />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>



    </div>
  );
}

export default App;
