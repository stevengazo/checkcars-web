// Mapa central de rutas de la API CheckCars.
// Respeta el casing real del backend (.NET), pero queda en un solo lugar
// para evitar strings dispersos y typos en los componentes.

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Account/Login",
    REGISTER: "/api/Account/Register",
    forgot: (email) => `/api/Account/Forgot?email=${encodeURIComponent(email)}`,
    RESET_PASSWORD: "/api/Account/Reset",
  },
  CARS: {
    BASE: "/api/Cars",
    byId: (id) => `/api/Cars/${id}`,
  },
  REPORTS: {
    ENTRY_EXIT: "/api/EntryExitReports",
    CRASH: "/api/CrashReports",
    ISSUE: "/api/IssueReports",
    RETURNS: "/api/VehicleReturns",
  },
  BOOKINGS: { BASE: "/api/Bookings" },
  USERS: { BASE: "/api/Users", DIC: "/api/GetUsersDic" },
  ROLES: {
    BASE: "/api/Roles",
    GET_ROLES: "/api/Roles/GetRoles",
    userRoles: (id) => `/api/Roles/GetUserRoles/${id}`,
  },
  REMINDERS: { BASE: "/api/Reminder" },
  CAR_SERVICES: { BASE: "/api/CarServices", RESUME: "/api/CarServices/Resume" },
  COMMENTARIES: { BASE: "/api/Commentary" },
  CHARTS: { BASE: "/api/Charts" },
  PHOTOS: { BASE: "/api/Photos" },
  FORM_DEFINITIONS: { BASE: "/api/FormDefinitions" },
  DYNAMIC_REPORTS: {
    BASE: "/api/DynamicReports",
    FORM: "/api/DynamicReports/form",
    SEARCH: "/api/DynamicReports/search",
    byCar: (id) => `/api/DynamicReports/ByCar/${id}`,
  },
  NOTIFICATIONS: {
    BASE: "/api/Notifications",
    UNREAD_COUNT: "/api/Notifications/unread/count",
    markRead: (id) => `/api/Notifications/${id}/read`,
    READ_ALL: "/api/Notifications/read-all",
  },
  CHATS: {
    BASE: "/api/Chats",
    byId: (id) => `/api/Chats/${id}`,
    messages: (id) => `/api/Chats/${id}/Messages`,
    createChat: "/api/Chats/CreateChat",
    sendMessage: (id) => `/api/Chats/${id}/SendMessage`,
  },
};

export default ENDPOINTS;
