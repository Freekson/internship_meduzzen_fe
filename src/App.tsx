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
import ProtectedRoute from "./Components/ProtectedRoute";
import UnauthenticatedRoute from "./Components/UnauthenticatedRoute";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartPage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>

        {/* //! Unauthenticated routes */}

        <Route
          path="/login"
          element={
            <UnauthenticatedRoute>
              <LoginPage />
            </UnauthenticatedRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <UnauthenticatedRoute>
              <RegisterPage />
            </UnauthenticatedRoute>
          }
        ></Route>

        {/* //! Protected routes */}

        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <CompanyProfilePage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/users-list"
          element={
            <ProtectedRoute>
              <UsersListPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/companies-list"
          element={
            <ProtectedRoute>
              <CompaniesListPage />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
