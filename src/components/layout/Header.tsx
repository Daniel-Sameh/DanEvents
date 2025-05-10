
// src/components/layout/Header.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-danevents-500" />
          <span className="text-xl font-bold text-danevents-500">DanEvents</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-danevents-500 transition-colors">
            Events
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-danevents-500 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Button onClick={handleLogout} variant="ghost">
                Log out
              </Button>
              <span className="text-muted-foreground">Hello, {user.name}</span>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Theme toggle */}
          <ThemeToggle />
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-20"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-10 bg-background/95 backdrop-blur-sm md:hidden">
            <div className="h-full w-full flex flex-col items-center justify-center space-y-8 p-8">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-danevents-500 text-2xl"
              >
                Events
              </Link>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-foreground hover:text-danevents-500 text-2xl"
                    >
                      Admin
                    </Link>
                  )}
                  <Button onClick={handleLogout} size="lg">
                    Log out
                  </Button>
                  <span className="text-muted-foreground text-lg">
                    Hello, {user.name}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="lg">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="lg">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
