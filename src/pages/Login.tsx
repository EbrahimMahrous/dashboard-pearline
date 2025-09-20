import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "../utils/storage";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = getFromStorage<string>("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (rememberMe) {
          setToStorage("rememberedEmail", email);
        } else {
          removeFromStorage("rememberedEmail");
        }
        navigate("/dashboard");
      } else {
        setError(result.message || t("invalid_credentials", "login"));
      }
    } catch (err: any) {
      setError(err.message || t("login_error", "login"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="bg-bg-primary p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md border border-light">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("login", "login")}
          </h1>
          <p className="text-muted">{t("welcome_message", "dashboard")}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-secondary text-sm font-semibold mb-2"
              htmlFor="email"
            >
              {t("email", "login")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-medium rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition duration-200"
              required
              disabled={isLoading}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div>
            <label
              className="block text-secondary text-sm font-semibold mb-2"
              htmlFor="password"
            >
              {t("password", "login")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-medium rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition duration-200"
              required
              disabled={isLoading}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-medium rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className={`${
                isRTL ? "mr-4" : "ml-4"
              } block text-sm text-secondary`}
            >
              {t("remember_me", "login")}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("signing_in", "login")}
              </span>
            ) : (
              t("sign_in", "login")
            )}
          </button>
        </form>

        {/* <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-accent-4 hover:text-accent-4-dark text-sm font-medium"
          >
            {isRTL ? "نسيت كلمة المرور؟" : "Forgot your password?"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
