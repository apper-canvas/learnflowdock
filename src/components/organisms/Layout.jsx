import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from "@/components/organisms/Header";

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;