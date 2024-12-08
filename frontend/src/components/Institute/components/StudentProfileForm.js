
import React, { useState, useEffect } from 'react';
import styles from './StudentProfileForm.module.css';
import { programsBySchool } from './Program';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().split('T')[0]; // Extract yyyy-MM-dd format
};


const StudentProfileForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    program: '',
    schoolOf: '',
    startDate: '',
    endDate: '',
    duration: '',
    accessLevel: 'basic',
    studyLevel: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

    // Pre-fill the form when `initialData` is provided (edit mode)
    useEffect(() => {
      if (initialData) {
        setFormData({
          ...initialData,
          startDate: formatDate(initialData.startDate), // Format start date
          endDate: formatDate(initialData.endDate), // Format end date
        });
      }
    }, [initialData]);
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address',
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'studentNumber',
      'firstName',
      'lastName',
      'email',
      'program',
      'schoolOf',
      'startDate',
      'endDate',
      'duration',
      'studyLevel',
    ];
  
    const newErrors = {};
  
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
  
    // Other validations (email, date range)
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
  
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] Form Submitted:', formData); // Debug FormData
  
    if (validateForm()) {
      try {
        await onSubmit(formData); // Trigger onSubmit prop from parent
        toast.success(initialData ? 'Profile updated successfully!' : 'Student profile added successfully!');
        navigate('/admin/dashboard'); // Navigate back to parent component
      } catch (error) {
        console.error('[ERROR] Submission Failed:', error); // Debug errors
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      console.warn('[WARNING] Validation Failed:', errors); // Debug validation errors
    }
  };
  
  const programs = programsBySchool[formData.schoolOf] || [];

  return (
    <div className={styles.studentProfileForm}>
      <h2 className={styles.heading}>
        {initialData ? 'Edit Student Profile' : 'Add New Student'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Student Number *</label>
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleInputChange}
              className={styles.inputField}
              disabled={!!initialData} // Disable editing for studentNumber in edit mode
            />
            {errors.studentNumber && <p className="text-red-600 text-sm">{errors.studentNumber}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>School of *</label>
            <select
              name="schoolOf"
              value={formData.schoolOf}
              onChange={handleInputChange}
              className={styles.inputField}
            >
              <option value="">Select School</option>
              <option value="business">School of Business</option>
              <option value="social_sciences">School of Social Sciences</option>
              <option value="computing">School of Computing, Technology and Applied Science (SOCTAZ) </option>
              <option value="law">School of Law</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Program *</label>
            <select
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              className={styles.inputField}
            >
              <option value="">Select a Program</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.startDate && <p className="text-red-600 text-sm">{errors.startDate}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.endDate && <p className="text-red-600 text-sm">{errors.endDate}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Duration of Study (Years) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Access Level *</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleInputChange}
              className={styles.inputField}
            >
              <option value="basic">Basic Student</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Study Level *</label>
            <select
              name="studyLevel"
              value={formData.studyLevel}
              onChange={handleInputChange}
              className={styles.inputField}
            >
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="PhD">PhD</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
        >
          {initialData ? 'Save Changes' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default StudentProfileForm;
