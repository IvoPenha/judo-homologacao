import { useState, useEffect, createContext, ReactNode } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface SignInProps {
  email: string;
  senha: string;
}

interface AuthContextData {
  user: string | null;
  isAuthenticated: boolean;
  signIn: ({ email, senha }: SignInProps) => Promise<any>;
  logout: () => void;
  registerAgremiacao?: (values: any) => Promise<any>;
  verifyToken: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const { "judo-auth-token": authToken } = parseCookies();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
  async function logout() {
    destroyCookie(undefined, "judo-auth-token");
    setUser(null);
    navigate("/login", { replace: true });
  }
  async function verifyToken() {
    const { "judo-auth-token": authToken } = parseCookies();
    if (!authToken) {
      logout();
    }
  }

  useEffect(() => {
    verifyToken();
    // if (token) {
    //   api.get('/me').then((response) => {
    //     setUser(response.data);
    //   }).catch(() => {
    //     destroyCookie(undefined, 'judo-auth-token');
    //     navigate('/login', { replace: true });
    //   });
    // 
  }, []);

  async function signIn({ email, senha }: SignInProps) {
    try {
      const response = await api.post("administrador/usuario-auth/login", {
        email,
        senha,
      });

      const { token, id } = response.data;

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 3);
      const expireDate = currentTime;

      setCookie(undefined, "judo-auth-token", token, {
        maxAge: 60 * 60 * 2, // 2 hour
      });

      setUser(response.data);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      return response;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  async function registerAgremiacao(values: any) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await api.post("gerencia/agremiacao", values, config);
      return response.data;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  // async function getAdmUserInfo (id: string) {
  //   try {
  //     const response = await api.get(`administrador/usuario/${id}`);
  //     return response.data;
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   return false;
  // }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, logout, user, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
