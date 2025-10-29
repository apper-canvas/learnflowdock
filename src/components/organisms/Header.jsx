import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
const { logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/my-learning", label: "My Learning", icon: "GraduationCap" },
    { path: "/profile", label: "Profile", icon: "User" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>

          <div className="hidden md:flex items-center">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/courses")}>
              <ApperIcon name="Search" size={18} className="mr-2" />
              Search
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <ApperIcon name="LogOut" size={18} className="mr-2" />
              Logout
            </Button>
            <div 
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-gradient-to-br from-primary to-purple-700 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold text-primary">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>

                <nav className="space-y-2 mb-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <ApperIcon name={item.icon} size={20} />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-700 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user?.firstName || 'Student'} {user?.lastName || ''}</div>
                      <div className="text-sm text-gray-600">{user?.emailAddress || 'View Profile'}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <ApperIcon name="LogOut" size={18} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;