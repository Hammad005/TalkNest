import { useState } from "react";
import { Eye, EyeOff, Info, Loader, Webhook } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import useThemeStore from "../store/useThemeStore";

const LoginPage = () => {
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });

  const [view, setView] = useState(false);
  const [errors, setErrors] = useState({});

  const { loginMutation, isPending } = useLogin();
  const {theme} = useThemeStore();

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      loginMutation(loginData);
    }
  };
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-8"
        data-theme={theme}
      >
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg shadow-primary/10 overflow-hidden">
          {/* FORM */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
            <div className="mb-4 flex items-center justify-start gap-2">
              <Webhook className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                TalkNest
              </span>
            </div>

            <div className="w-full">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                    <p className="text-sm opacity-70">
                      Sign in to your account to continue your language journey.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="text"
                        placeholder="hello@gmail.com"
                        className="input input-bordered w-full"
                        value={loginData.email}
                        onChange={(e) =>
                          setloginData({ ...loginData, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="form-control w-full space-y-2 relative">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>

                      <input
                        type={view ? "text" : "password"}
                        placeholder="********"
                        className="input input-border w-full"
                        value={loginData.password}
                        onChange={(e) =>
                          setloginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                      <div
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${
                          !errors.password ? "mt-3" : "mt-0.5"
                        } z-10`}
                      >
                        {view ? (
                          <EyeOff
                            className="cursor-pointer text-primary/70"
                            onClick={() => setView(!view)}
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer text-primary/70"
                            onClick={() => setView(!view)}
                          />
                        )}
                      </div>
                      {errors.password && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.password}
                        </p>
                      )}
                    </div>

                    <button
                      disabled={isPending}
                      className="btn btn-primary w-full"
                      type="submit"
                    >
                      {isPending ? (
                        <Loader className="animate-spin size-4" />
                      ) : (
                        "Sign In"
                      )}
                    </button>
                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Don't have an account?{" "}
                        <Link
                          to={"/signup"}
                          className="text-primary hover:underline"
                        >
                          Create one
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* IMG */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-2-md p-8">
              <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/login.png" alt="Signup" className="w-full h-full" />
              </div>

              <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold text-primary">
                  Connect with language partners worldwide
                </h2>
                <p className="opacity-70 text-sm">
                  Practice conversations, make friends, and improve your
                  language skills together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
