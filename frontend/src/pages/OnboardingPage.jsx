import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, Loader, MapPin, ShuffleIcon, Webhook } from "lucide-react";
import { LANGUAGES } from "../constants";
import useThemeStore from "../store/useThemeStore";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const [formState, setFormState] = useState({
    fullName: authUser.fullName || "",
    bio: authUser.bio || "",
    nativeLanguage: authUser.nativeLanguage || "",
    learningLanguage: authUser.learningLanguage || "",
    location: authUser.location || "",
    profilePic: authUser?.profilePic || "",
  });
  const {theme} = useThemeStore();

  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => toast.error(error?.response?.data?.error),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({
      ...formState,
      profilePic: randomAvatar,
    });
  };
  return (
    <>
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4" data-theme={theme}>
        <div className="card bg-base-200 w-full max-w-3xl shadow-lg shadow-primary/10 border border-primary">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden border-2 border-primary">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Pic"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-accent"
                    type="button"
                    onClick={handleRandomAvatar}
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              <div className="from-control my-1">
                <label className="label mb-1">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              <div className="from-control my-1">
                <label className="label mb-1">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="Tell others about yourself and your language learning gaols"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="form-control">
                  <label className="label mb-1">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select your native language
                    </option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toUpperCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label mb-1">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select your learning language
                    </option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toUpperCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control my-1">
                <label className="label mb-1">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70 z-10`}
                  />
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full mt-3" disabled={isPending}>
                {!isPending ? (
                  <>
                  <Webhook className="size-5"/>
                  Complete Onboarding
                  </>
                ) : (
                  <Loader className="animate-spin size-5"/>
                )
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;
