import React, { useState, useEffect } from 'react';
import StudentProfileForm from './StudentProfileForm';
import DialogBox from '../../../utils/DialogBox';
import styles from './Profile.module.css';
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom

const Profile = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null); // Track the student being edited
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
    setEditStudent(null); // Reset editing state when toggling the form
  };

  const fetchStudentProfiles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/student/fetchAllProfiles', {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        setError(data.message || 'Failed to fetch student profiles.');
      }
    } catch (err) {
      setError('An error occurred while fetching profiles.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (studentId) => {
    setStudentToDelete(studentId);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    setDialogVisible(false);
    if (!studentToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/student/deleteProfile?id=${studentToDelete}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentToDelete));
        toast.success('Student profile deleted successfully!');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete student profile.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setStudentToDelete(null);
      
    }
  };

  const cancelDelete = () => {
    setDialogVisible(false);
    setStudentToDelete(null);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setShowForm(true); // Open form in edit mode
  };

  const handleFormSubmit = async (formData) => {
    console.log('[DEBUG] Form Submission Data:', formData); // Debug form data
  
    try {
      if (editStudent) {
        // Update existing profile
        console.log('[DEBUG] Updating Profile:', editStudent._id); // Debug edit mode
  
        const response = await fetch(
          `http://localhost:5000/api/student/updateProfile/${editStudent._id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );
  
        const updatedStudent = await response.json();
        console.log('[DEBUG] Update Response:', updatedStudent);
  
        if (response.ok) {
          setStudents((prev) =>
            prev.map((student) =>
              student._id === updatedStudent._id ? { ...student, ...updatedStudent } : student
            )
          );
        } else {
          throw new Error(updatedStudent.message || 'Failed to update student profile.');
        }
      } else {
        // Save new profile
        console.log('[DEBUG] Adding New Profile:', formData); // Debug add mode
  
        const response = await fetch('http://localhost:5000/api/student/saveProfile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const newStudent = await response.json();
        console.log('[DEBUG] Save Response:', newStudent);
  
        if (response.ok) {
          setStudents((prev) => [...prev, newStudent]);
        } else {
          throw new Error(newStudent.message || 'Failed to save student profile.');
        }
      }
    } catch (error) {
      console.error('[ERROR] Form Submission Failed:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setShowForm(false);
      setEditStudent(null);
      navigate('/admin/dashboard'); // Navigate back to the InstituteDashboard
    }
  };
  
  useEffect(() => {
    fetchStudentProfiles();
  }, []);

  
  return (
    <div>
      <ToastContainer />
      <DialogBox
        show={dialogVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this student profile? This action cannot be undone."
      />
      {showForm ? (
        <div>
          <button onClick={handleToggleForm} className={styles.addButton}>
            <FaArrowLeft className={styles.icon} />
            Profile Management
          </button>
          <StudentProfileForm
            initialData={editStudent} // Pass student data for editing
            onSubmit={handleFormSubmit}
          />
        </div>
      ) : (
        <div>
          <div className={styles.header}>
            <h2 className="text-3xl font-bold">Profile Management</h2>
            <button onClick={handleToggleForm} className={styles.addButton}>
              Add Student
            </button>
          </div>

          {isLoading ? (
            <p>Loading student profiles...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className={styles.container}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Program</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.studentNumber}</td>
                      <td>{`${student.firstName} ${student.lastName}`}</td>
                      <td>{student.program || 'N/A'}</td>
                      <td>{student.studyLevel || 'N/A'}</td>
                      <td className={styles.actionButtons}>
                        <button
                          className={`${styles.actionButton} ${styles.edit}`}
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.delete}`}
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
