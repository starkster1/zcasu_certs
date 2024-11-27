import React from "react";
import { FiClock } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiFileTextLine } from "react-icons/ri";
import "./CertificateCard.css"; // Import CSS styling

const CertificateCard = ({
  title = "Certificate Title",
  status = "Pending",
  uploadDate = new Date(),
  uploaderAddress = "0x123...abc",
  issuer = "ZCASU University",
  onView = () => {},
}) => {
  return (
    <div
      className="certificate-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      aria-label={`Certificate card for ${title}`}
      role="region"
    >
      {/* Issuer Banner */}
      <div className="issuer-banner" aria-label={`Issued by ${issuer}`}>
        {issuer}
      </div>

      {/* Card Content */}
      <div className="card-content p-6 pt-8">
        {/* Header Section */}
        <div className="header flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="title text-xl font-bold text-gray-800 mb-2">
              {title}
            </h3>
            <div className="upload-date flex items-center space-x-2 text-gray-600 text-sm">
              <FiClock className="text-gray-400" aria-hidden="true" />
              <span>{new Date(uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div
            className={`status-icon flex items-center justify-center w-12 h-12 rounded-full ${
              status === "Verified" ? "bg-green-100" : "bg-yellow-100"
            }`}
            aria-label={`Certificate is ${status}`}
          >
            <BsCheckCircleFill
              className={`status-icon-text text-2xl ${
                status === "Verified" ? "text-green-500" : "text-yellow-500"
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="details space-y-3">
          {/* Status Row */}
          <div className="status-row flex items-center justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <span
              className={`status-label px-3 py-1 rounded-full ${
                status === "Verified"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status}
            </span>
          </div>

          {/* Uploader Row */}
          <div className="uploader-row flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploader</span>
            <span
              className="uploader-address font-mono text-gray-700"
              aria-label={`Uploader address is ${uploaderAddress}`}
            >
              {uploaderAddress}
            </span>
          </div>
        </div>

        {/* View Button */}
        <button
          className="view-button mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onView}
          aria-label={`View certificate details for ${title}`}
        >
          <RiFileTextLine className="text-lg" aria-hidden="true" />
          <span>View Certificate</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
