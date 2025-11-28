import Cookies from "js-cookie";
import type { UserRoles } from "@/types/user";

const USER_ROLE_COOKIE = "user_role";

const getUserRole = (): UserRoles | null => {
  if (typeof window === "undefined") return null;
  const role = Cookies.get(USER_ROLE_COOKIE);
  return (role as UserRoles) || null;
};

const setUserRole = (role: UserRoles | null) => {
  if (typeof window === "undefined") return;
  if (role) {
    Cookies.set(USER_ROLE_COOKIE, role, { expires: 365 }); // 1 year
  } else {
    Cookies.remove(USER_ROLE_COOKIE);
  }
};

const clearUserRole = () => {
  if (typeof window === "undefined") return;
  Cookies.remove(USER_ROLE_COOKIE);
};

const userService = {
  getUserRole,
  setUserRole,
  clearUserRole,
};

export default userService;
