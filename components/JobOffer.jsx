import { useState } from "react";

export default function JobForm() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobTypes: [],
    link: "",
    source: "",
    description: "",
    postedAt: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Remote",
    "Hybrid",
    "On-site",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobTypeChange = (jobType) => {
    setFormData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter((type) => type !== jobType)
        : [...prev.jobTypes, jobType],
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "company",
      "location",
      "salary",
      "link",
      "source",
      "description",
      "postedAt",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        setMessage({
          type: "error",
          text: `Please fill in the ${
            field.charAt(0).toUpperCase() + field.slice(1)
          } field`,
        });
        return false;
      }
    }

    if (formData.jobTypes.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one job type",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://167.71.135.22:3000/jobs/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_TOKEN,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Job posted successfully!" });
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          jobTypes: [],
          link: "",
          source: "",
          description: "",
          postedAt: "",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Failed to post job",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg ">
      {message.text && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 placeholder:text-sm"
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. Tech Corp Inc."
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. San Francisco, CA or Remote"
          />
        </div>

        {/* Salary */}
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Salary *
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            required
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. $80,000 - $120,000 or Competitive"
          />
        </div>

        {/* Job Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Types *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {jobTypeOptions.map((jobType) => (
              <label
                key={jobType}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.jobTypes.includes(jobType)}
                  onChange={() => handleJobTypeChange(jobType)}
                  className="placeholder:text-sm rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{jobType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Link */}
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Posting Link *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="https://company.com/jobs/123"
          />
        </div>

        {/* Source */}
        <div>
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Source *
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            required
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. LinkedIn, Indeed, Company Website"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={6}
            className="placeholder:text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
            placeholder="Detailed job description, requirements, responsibilities..."
          />
        </div>

        {/* Posted At */}
        <div>
          <label
            htmlFor="postedAt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Posted Date *
          </label>
          <input
            type="date"
            id="postedAt"
            name="postedAt"
            value={formData.postedAt}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-offset-2"
            } transition duration-200`}
          >
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
