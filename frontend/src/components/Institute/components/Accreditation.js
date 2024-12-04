import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCheck } from "react-icons/fi";

import styles from "./Accreditation.module.css";

const AccreditationSystem = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    program: "",
    graduationDate: ""
  });
  const [errors, setErrors] = useState({});
  const [certificate, setCertificate] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setCertificate(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "studentName":
        if (!value.trim()) {
          newErrors[name] = "Student name is required";
        } else {
          delete newErrors[name];
        }
        break;
      case "studentId":
        if (!value.trim()) {
          newErrors[name] = "Student ID is required";
        } else {
          delete newErrors[name];
        }
        break;
      case "program":
        if (!value.trim()) {
          newErrors[name] = "Program is required";
        } else {
          delete newErrors[name];
        }
        break;
      case "graduationDate":
        if (!value) {
          newErrors[name] = "Graduation date is required";
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (!certificate) newErrors.certificate = "Certificate PDF is required";

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData, certificate);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* Add university logo */}
        <img
            src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png" // Replace with your logo's actual path
            alt="University Logo"
            className={styles.logo}
        />
        <h1 className={styles.title}>Accreditation System</h1>
        <p className={styles.subtitle}>
          Enter student information and upload required documents
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Student Name</label>
            <input
              type="text"
              name="studentName"
              className={`${styles.input} ${
                errors.studentName ? styles.errorInput : ""
              }`}
              value={formData.studentName}
              onChange={handleInputChange}
            />
            {errors.studentName && (
              <p className={styles.errorMessage}>{errors.studentName}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Student ID</label>
            <input
              type="text"
              name="studentId"
              className={`${styles.input} ${
                errors.studentId ? styles.errorInput : ""
              }`}
              value={formData.studentId}
              onChange={handleInputChange}
            />
            {errors.studentId && (
              <p className={styles.errorMessage}>{errors.studentId}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Program</label>
            <select
              name="program"
              className={`${styles.input} ${
                errors.program ? styles.errorInput : ""
              }`}
              value={formData.program}
              onChange={handleInputChange}
            >
              <option value="">Select a program</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
            </select>
            {errors.program && (
              <p className={styles.errorMessage}>{errors.program}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Graduation Date</label>
            <input
              type="date"
              name="graduationDate"
              className={`${styles.input} ${
                errors.graduationDate ? styles.errorInput : ""
              }`}
              value={formData.graduationDate}
              onChange={handleInputChange}
            />
            {errors.graduationDate && (
              <p className={styles.errorMessage}>{errors.graduationDate}</p>
            )}
          </div>

          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${
              isDragActive ? styles.activeDropzone : ""
            }`}
          >
            <FiUpload className={styles.dropzoneIcon} />
            <input {...getInputProps()} />
            <p>Drag and drop a PDF file here, or click to select a file</p>
          </div>

          {certificate && (
            <div className={styles.fileInfo}>
              <FiCheck className={styles.fileIcon} />
              <span>{certificate.name}</span>
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccreditationSystem;
