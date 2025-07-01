import React from "react";
import { Link } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, LogOutIcon } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-background shadow-sm">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-danevents-500" />
            <span className="text-2xl font-bold text-danevents-500 font-poppins">
              DanEvents
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline">Admin Dashboard</Button>
                  </Link>
                )}
                <Link 
                  to="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user.name}
                  </span>
                  {user.profileImageUrl && user.profileImageUrl !== "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground"
                >
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline-block">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
            <ThemeToggle/>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
