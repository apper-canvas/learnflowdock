import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "@/services/api/courseService";
import enrollmentService from "@/services/api/enrollmentService";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [courseData, enrollmentData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        enrollmentService.getById(parseInt(courseId))
      ]);

      if (!courseData) {
        setError("Course not found");
        return;
      }

      if (!enrollmentData) {
        setError("You are not enrolled in this course");
        return;
      }

      if (enrollmentData.progress !== 100) {
        setError("Certificate is only available after course completion");
        return;
      }

      setCourse(courseData);
      setEnrollment(enrollmentData);
    } catch (err) {
      setError(err.message || "Failed to load certificate data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadCertificate() {
    if (!course || !enrollment) return;

    try {
      setDownloading(true);

      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Generate certificate ID
      const certificateId = `CERT-${courseId}-${enrollment.Id}-${Date.now()}`;
      
      // Format completion date
      const completionDate = new Date(enrollment.enrolledDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Invoke Edge function
      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_GENERATE_CERTIFICATE,
        {
          body: JSON.stringify({
            courseName: course.title,
            studentName: "LearnFlow Student", // Placeholder - would be actual user name
            completionDate: completionDate,
            certificateId: certificateId
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const responseData = await result.json();

      if (!responseData.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_CERTIFICATE}. The response body is: ${JSON.stringify(responseData)}.`);
        toast.error(responseData.error || "Failed to generate certificate");
        return;
      }

      // Convert base64 to blob and download
      const byteCharacters = atob(responseData.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = responseData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_CERTIFICATE}. The error is: ${error.message}`);
      toast.error("Failed to download certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/my-learning")}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to My Learning</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Certificate of Completion</h1>
            <p className="text-gray-600 mt-2">
Congratulations on completing {course.title}!
            </p>
          </div>

          {/* Certificate Preview Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="border-4 border-primary rounded-lg p-8 relative">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-secondary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-secondary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-secondary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-secondary rounded-br-lg"></div>

              {/* Certificate Content */}
              <div className="text-center space-y-6 py-8">
                <div>
                  <h2 className="text-4xl font-bold text-primary mb-2">
                    Certificate of Completion
                  </h2>
                  <div className="w-48 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
                </div>

                <p className="text-gray-600 text-lg">This is to certify that</p>

                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">LearnFlow Student</p>
                  <div className="w-64 h-px bg-gray-300 mx-auto"></div>
                </div>

                <p className="text-gray-600 text-lg">has successfully completed</p>

                <h3 className="text-2xl font-bold text-primary px-8">
{course.title}
                </h3>

                <p className="text-gray-600">
                  Completed on {new Date(enrollment.enrolledDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                {/* Signature Section */}
                <div className="flex justify-around pt-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-48 h-px bg-gray-300 mb-2"></div>
                    <p className="text-sm text-gray-600">Instructor Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 h-px bg-gray-300 mb-2"></div>
                    <p className="text-sm text-gray-600">Program Director</p>
                  </div>
                </div>

                {/* Certificate ID */}
                <p className="text-xs text-gray-400 pt-6">
                  Certificate ID: CERT-{courseId}-{enrollment.Id}-PREVIEW
                </p>

                {/* Branding */}
                <div className="pt-4">
                  <p className="text-lg font-bold text-primary">LearnFlow</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadCertificate}
              disabled={downloading}
              className="flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <ApperIcon name="Loader2" size={20} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Download" size={20} />
                  <span>Download Certificate</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/my-learning")}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to My Learning</span>
            </Button>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ApperIcon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">About Your Certificate</p>
                <p className="text-blue-700">
                  This certificate verifies that you have successfully completed all course requirements 
for "{course.title}". You can download it as a PDF and share it on your professional 
                  profiles or with potential employers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}