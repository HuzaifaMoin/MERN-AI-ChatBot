import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

type User = {
  name: string;
  email: string;
};
type UserAuth = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // fetch if the user's cookies are valid then skip login
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        if (data && isMounted) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      } catch (error) {
        // 401 Unauthorized is expected when user is not logged in
        if (isMounted) {
          setUser(null);
          setIsLoggedIn(false);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }
    checkStatus();

    return () => {
      isMounted = false;
    };
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
      setIsAuthLoading(false);
    }
  }, []);
  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
      setIsAuthLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setIsAuthLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      isAuthLoading,
      login,
      logout,
      signup,
    }),
    [user, isLoggedIn, isAuthLoading, login, logout, signup]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
