import { useState } from "react";
import { Eye, EyeOff, Info, Loader, Webhook } from "lucide-react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import useThemeStore from "../store/useThemeStore";
const SignupPage = () => {
  const [signupData, setsignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [conPassword, setConPassword] = useState("");
  const [view, setView] = useState({
    password: false,
    conPassword: false,
  });
  const [errors, setErrors] = useState({});
  const {theme} = useThemeStore();

  const {signupMutation, isPending} = useSignup();
  const handleSignup = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!signupData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (signupData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }
    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!conPassword) {
      newErrors.conPassword = "Confirm password is required";
    } else if (conPassword !== signupData.password) {
      newErrors.conPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      signupMutation(signupData);
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
          <div className="w-ful lg:w-1/2 p-4 sm:p-8 flex flex-col">
            <div className="mb-4 flex items-center justify-start gap-2">
              <Webhook className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                TalkNest
              </span>
            </div>
            <div className="w-full">
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Create an Account</h2>
                    <p className="text-sm opacity-70">
                      Join TalkNest and start your language learning adventure.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="form-control w-full">
                      <label className="label mb-1">
                        <span className="label-text">Full Name</span>
                      </label>

                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input input-border w-full"
                        value={signupData.fullName}
                        onChange={(e) =>
                          setsignupData({
                            ...signupData,
                            fullName: e.target.value,
                          })
                        }
                      />
                      {errors.fullName && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="form-control w-full">
                      <label className="label mb-1">
                        <span className="label-text">Email</span>
                      </label>

                      <input
                        type="text"
                        placeholder="John@gmail.com"
                        className="input input-border w-full"
                        value={signupData.email}
                        onChange={(e) =>
                          setsignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                      />
                      {errors.email && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="form-control w-full relative">
                      <label className="label mb-1">
                        <span className="label-text">Password</span>
                      </label>

                      <input
                        type={view.password ? "text" : "password"}
                        placeholder="********"
                        className="input input-border w-full"
                        value={signupData.password}
                        onChange={(e) =>
                          setsignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
                      />
                      <div
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${
                          !errors.password ? "mt-3.5" : "mt-1"
                        } z-10`}
                      >
                        {view.password ? (
                          <EyeOff
                            className="cursor-pointer text-primary/70"
                            onClick={() =>
                              setView({ ...view, password: !view.password })
                            }
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer text-primary/70"
                            onClick={() =>
                              setView({ ...view, password: !view.password })
                            }
                          />
                        )}
                      </div>
                      {errors.password && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="form-control w-full relative">
                      <label className="label mb-1">
                        <span className="label-text">Confirm Password</span>
                      </label>

                      <input
                        type={view.conPassword ? "text" : "password"}
                        placeholder="********"
                        className="input input-border w-full"
                        value={conPassword}
                        onChange={(e) => setConPassword(e.target.value)}
                      />
                      <div
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${
                          !errors.conPassword ? "mt-3.5" : "mt-1"
                        } z-10`}
                      >
                        {view.conPassword ? (
                          <EyeOff
                            className="cursor-pointer text-primary/70"
                            onClick={() =>
                              setView({
                                ...view,
                                conPassword: !view.conPassword,
                              })
                            }
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer text-primary/70"
                            onClick={() =>
                              setView({
                                ...view,
                                conPassword: !view.conPassword,
                              })
                            }
                          />
                        )}
                      </div>
                      {errors.conPassword && (
                        <p className="text-xs mt-1 opacity-70 text-primary flex gap-1 items-center">
                          <Info className="size-[13px]" /> {errors.conPassword}
                        </p>
                      )}
                    </div>
                  </div>
                  <button disabled={isPending} className="btn btn-primary w-full" type="submit">
                    {isPending ? <Loader className="animate-spin size-4"/> : "Create Account"}
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already have an account?{" "}
                      <Link
                        to={"/login"}
                        className="text-primary hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* IMG */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-2-md p-8">
              <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/signup.png" alt="Signup" className="w-full h-full" />
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

export default SignupPage;
