import StartPage from "./Pages/StartPage";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import { RootState, useAppDispatch } from "./Store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { ReduxStatus } from "./Types/enums";
import { fetchUser } from "./Store/user/slice";
import "react-toastify/dist/ReactToastify.css";
import UserPage from "./Pages/UserPage";
import CompanyPage from "./Pages/CompanyPage";
import { handleLogout } from "./Utils/handleLogout";
import { toast } from "react-toastify";
import UserInvitationPage from "./Pages/UserInvitationPage";
import UserRequestPage from "./Pages/UserRequestPage";
import CompanyRequestPage from "./Pages/CompanyRequestPage";
import CompanyInvitationPage from "./Pages/CompanyInvitationPage";
import routes from "./routes";
import QuizPage from "./Pages/QuizPage";
import CompanyStatisticsPage from "./Pages/CompanyStatisticsPage";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && status === ReduxStatus.INIT) {
      dispatch(fetchUser(""));
    }
    if (status === ReduxStatus.ERROR) {
      handleLogout(dispatch, navigate);
      toast.warning("Your token has expired");
    }
  }, [dispatch, navigate, status, token]);

  return (
    <div className="App">
      <Routes>
        <Route path={routes.start} element={<StartPage />} />
        <Route path={routes.about} element={<AboutPage />} />

        {/* //! Unauthenticated routes */}
        <Route
          path={routes.login}
          element={
            <UnauthenticatedRoute>
              <LoginPage />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path={routes.register}
          element={
            <UnauthenticatedRoute>
              <RegisterPage />
            </UnauthenticatedRoute>
          }
        />

        {/* //! Protected routes */}
        <Route
          path={routes.companyProfile}
          element={
            <ProtectedRoute>
              <CompanyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.userProfile}
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.usersList}
          element={
            <ProtectedRoute>
              <UsersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.companiesList}
          element={
            <ProtectedRoute>
              <CompaniesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.userInvites}
          element={
            <ProtectedRoute>
              <UserInvitationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.userRequests}
          element={
            <ProtectedRoute>
              <UserRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.companyRequests(":id")}
          element={
            <ProtectedRoute>
              <CompanyRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.companyInvites(":id")}
          element={
            <ProtectedRoute>
              <CompanyInvitationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.userPage(":id")}
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.companyPage(":id")}
          element={
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.quizPage(":id")}
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.companyStatisticsPage(":id")}
          element={
            <ProtectedRoute>
              <CompanyStatisticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
