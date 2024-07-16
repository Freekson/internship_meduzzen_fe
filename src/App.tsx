import StartPage from "./Pages/StartPage";
import { Route, Routes } from "react-router-dom";
import AboutPage from "./Pages/AboutPage";
import "./App.scss";
import CompanyProfilePage from "./Pages/CompanyProfilePage";
import UserProfilePage from "./Pages/UserProfilePage";
import UsersListPage from "./Pages/UsersListPage";
import CompaniesListPage from "./Pages/CompaniesListPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartPage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/company" element={<CompanyProfilePage />}></Route>
        <Route path="/profile" element={<UserProfilePage />}></Route>
        <Route path="/users-list" element={<UsersListPage />}></Route>
        <Route path="/companies-list" element={<CompaniesListPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
