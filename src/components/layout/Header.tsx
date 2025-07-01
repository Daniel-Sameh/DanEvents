import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  UserIcon, 
  LogOutIcon, 
  MenuIcon,
  X as CloseIcon,
  ShieldIcon
} from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";


const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  // Mobile navigation for authenticated users
  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={cn(
              "w-72", 
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
              "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
      )}>
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            {user?.profileImageUrl && user.profileImageUrl !== "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profileImageUrl} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user?.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          <Link 
            to="/account" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors"
          >
            <UserIcon className="h-4 w-4" />
            <span>My Account</span>
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors"
            >
              <ShieldIcon className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center justify-start gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          
          {/* <div className="px-3 py-2">
            <ThemeToggle className="" />
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );

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
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline">Admin Dashboard</Button>
                    </Link>
                  )}
                  <Link 
                    to="/account"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <span className="text-sm font-medium">
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
                    <span>Logout</span>
                  </Button>
                  {/* <ThemeToggle className="hidden md:flex" /> */}
                </div>
                
                {/* Mobile Navigation */}
                <MobileNav />
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
            <ThemeToggle className=""/>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
