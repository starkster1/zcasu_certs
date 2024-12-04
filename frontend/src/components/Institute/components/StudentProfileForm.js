import React, { useState } from 'react';
import styles from './StudentProfileForm.module.css';

const StudentProfileForm = () => {
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    program: "",             // New field for Program
    schoolOf: "computing",    // New field for School of
    startDate: "",
    endDate: "",
    duration: "",
    accessLevel: "basic",
    studyLevel: "diploma",
    
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Please enter a valid email address"
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/student/saveProfile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Form submitted:", responseData);
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
        } else {
          console.error("Failed to save profile:", response.statusText);
          setErrors({ submit: "Failed to save profile. Please try again." });
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        setErrors({ submit: "Failed to save profile. Please try again." });
      }
    }
  };

  return (
    <div className={styles.studentProfileForm}>
      <h2 className="text-3xl font-bold mb-6 text-center">Student Profile Form</h2>
      {isSubmitted && <p className="text-green-600 mb-4">Form submitted successfully!</p>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Student Number *</label>
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Program *</label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.program && <p className="text-red-600 text-sm">{errors.program}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>School of *</label>
            <select
              name="schoolOf"
              value={formData.schoolOf}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="computing">Computing</option>
              <option value="business">Business</option>
              <option value="law">Law</option>
              {/* Add more options as needed */}
            </select>
            {errors.schoolOf && <p className="text-red-600 text-sm">{errors.schoolOf}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
            />
            {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Access Level *</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="basic">Basic Student</option>
              <option value="advanced">Advanced Student</option>
            </select>
            {errors.accessLevel && <p className="text-red-600 text-sm">{errors.accessLevel}</p>}
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Study Level *</label>
            <select
              name="studyLevel"
              value={formData.studyLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master</option>
            </select>
            {errors.studyLevel && <p className="text-red-600 text-sm">{errors.studyLevel}</p>}
          </div>
        </div>
        
        <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
          Submit Profile
        </button>
        {errors.submit && <p className="text-red-600 text-sm mt-4">{errors.submit}</p>}
      </form>
    </div>
  );
};
export default StudentProfileForm;
