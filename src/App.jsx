import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Certificate from "@/components/pages/Certificate";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import CourseCatalog from "@/components/pages/CourseCatalog";
import CourseDetail from "@/components/pages/CourseDetail";
import LessonViewer from "@/components/pages/LessonViewer";
import MyLearning from "@/components/pages/MyLearning";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
<Route path="/my-learning" element={<MyLearning />} />
          <Route path="/certificates/:courseId" element={<Certificate />} />
        </Routes>
      </Layout>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;