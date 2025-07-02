import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router-dom";
import { Bell, Loader, LogOut, Webhook } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const {logoutMutation, isPending} = useLogout();
  
  return (
    <nav className="bg-case-200 border-b border-base-300  h-16 flex items-center">
      <div className="container mx-auto">
        <div className="flex items-center justify-end w-full gap-2">
          {isChatPage && (
            <div className="pl-5">
              <Link to={"/"} className="flex items-center gap-2.5">
                <Webhook className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  TalkNest
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <Bell className="size-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="h-7.5 rounded-full">
              <img src={authUser?.profilePic} alt="Avatar" rel="noreferrer" />
            </div>
          </div>

          <button className={`btn btn-ghost btn-circle ${isPending && "pointer-events-none"}`} onClick={logoutMutation} disabled={isPending}>
            {
              isPending ? 
              <Loader className="size-6 text-base-content opacity-70 animate-spin"/>
              :
            <LogOut className="size-6 text-base-content opacity-70" />
            }
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
