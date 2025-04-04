import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useUserProfile } from "../../../hooks/useUserProfile";
import toast from "react-hot-toast";
import {
  MobileDocumentIcon,
  LogoutIcon,
  UserIcon,
  ChevronDownIcon,
} from "../../../utils/icons";

export interface HeaderProps {
  showAddTaskButton?: boolean;
  onAddTaskClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuthContext();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Use the profile displayName if available, fall back to user.displayName
  const displayName = profile?.displayName || user?.displayName || "Profile";
  // Use the profile photoURL if available, fall back to user.photoURL
  const photoURL = profile?.photoURL || user?.photoURL;

  return (
    <header className="border-b border-gray-200 bg-white py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and title */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <MobileDocumentIcon width={24} height={24} color="#2F2F2F" />
          <h1 className="font-semibold text-[#2F2F2F] text-xl">TaskBuddy</h1>
        </Link>

        {/* Right side content */}
        <div className="flex items-center gap-4">
          {/* User profile with dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {displayName.charAt(0) || user.email?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{displayName}</span>
                <ChevronDownIcon className="w-6 h-6 text-gray-500" />
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <UserIcon className="w-5 h-5 mt-2" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogoutIcon className="w-6 h-6 mt-3" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
