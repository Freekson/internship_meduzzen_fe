const routes = {
  start: "/",
  about: "/about",
  login: "/login",
  register: "/register",
  companyProfile: "/company",
  userProfile: "/profile",
  usersList: "/users-list",
  companiesList: "/companies",
  userInvites: "/user/invites",
  userRequests: "/user/requests",
  userNotifications: "/user/notifications",
  companyRequests: (id: string | number) => `/company/${id}/requests`,
  companyInvites: (id: string | number) => `/company/${id}/invites`,
  userPage: (id: string | number) => `/user/${id}`,
  companyPage: (id: string | number) => `/companies/${id}`,
  quizPage: (id: string | number) => `/quiz/${id}`,
  companyStatisticsPage: (id: string | number) => `/company/${id}/statistics`,
};

export default routes;
