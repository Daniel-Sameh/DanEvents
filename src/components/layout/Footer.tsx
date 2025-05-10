
import React from "react";
import { CalendarIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted-50 border-t border-muted-100">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <CalendarIcon className="h-6 w-6 text-danevents-500" />
            <span className="text-xl font-bold text-danevents-500">
              DanEvents
            </span>
          </div>
          
          <div className="text-center md:text-right text-sm text-muted-500">
            <p>&copy; {new Date().getFullYear()} DanEvents. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
