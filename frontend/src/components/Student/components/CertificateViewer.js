import React from 'react';
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaClock } from "react-icons/fa";

const CertificateViewer = ({ studentData, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Certificate Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{studentData.fullName}</p></div>
              <div><p className="text-sm text-gray-500">Student Number</p><p className="font-medium">{studentData.studentNumber}</p></div>
              <div><p className="text-sm text-gray-500">Program</p><p className="font-medium">{studentData.program}</p></div>
              <div><p className="text-sm text-gray-500">Level</p><p className="font-medium">{studentData.level}</p></div>
              <div><p className="text-sm text-gray-500">School</p><p className="font-medium">{studentData.school}</p></div>
              <div><p className="text-sm text-gray-500">Program Duration</p><p className="font-medium">{studentData.programDuration}</p></div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm text-gray-500">Certificate Title</p><p className="font-medium">{studentData.certificateTitle}</p></div>
              <div><p className="text-sm text-gray-500">Issue Date</p><p className="font-medium">{studentData.issueDate}</p></div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center space-x-2">
                  {studentData.status === "verified" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-2" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FaClock className="mr-2" /> Pending
                    </span>
                  )}
                </div>
              </div>
              <div><p className="text-sm text-gray-500">Issuer</p><p className="font-medium">{studentData.issuer}</p></div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Certificate Preview</h3>
            <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden border border-gray-200">
              <iframe src={studentData.certificateUrl} title="Certificate Preview" className="w-full h-full" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;
