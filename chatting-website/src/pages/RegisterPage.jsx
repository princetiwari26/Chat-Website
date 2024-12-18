
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext"; // Import the notification hook

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null); // For image preview
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleUsernameCheck = async () => {
    if (!username) {
      setErrorMessage("Username is required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/user/check-username",
        { username }
      );
      if (response.data.available) {
        setErrorMessage("");
        setStep(2);
      } else {
        setErrorMessage(
          "Username is already exist. Please try another username"
        );
      }
    } catch (error) {
      setErrorMessage("Failed to check username availability.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    let profilePhotoBase64 = "";
    if (profilePicture) {
      const reader = new FileReader();
      reader.readAsDataURL(profilePicture);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          profilePhotoBase64 = reader.result;
          resolve();
        };
      });
    }

    const registrationData = {
      username,
      name,
      email,
      gender,
      dob,
      password,
      profilePicture: profilePhotoBase64,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/user/register",
        registrationData
      );
      addNotification("Registration successful!", "success");
      navigate("/login");
    } catch (error) {
      addNotification("Registration failed. Please try again.", "error");
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-300 grid place-content-center relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      {step === 1 && (
        <div className="w-60 bg-white p-2">
          <div className="w-full grid place-items-center mt-4">
            <div className="uppercase text-2xl font-bold">Register</div>
            <div className="w-12 h-1 mt-2 bg-slate-900"></div>
          </div>

          <div className="p-4 mt-3">
            <label className="text-slate-900">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-200 mt-1 p-2 h-7 rounded-sm focus:outline-none placeholder:text-sm"
              type="text"
              placeholder="Enter Username"
            />
            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
          </div>

          <div className="w-full grid place-items-center mt-2">
            <button
              onClick={handleUsernameCheck}
              className="bg-slate-900 w-13 text-white px-3 py-1 rounded-md"
            >
              Next
            </button>
            <div className="text-sm my-3">
              Already have an account?{" "}
              <span className="text-sky-700 cursor-pointer hover:underline">
                <Link to={"/login"}>Login</Link>
              </span>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className=" relative w-60 bg-white p-2 grid place-items-center">
          <div className=" absolute left-0 top-0 m-2 ">
            <p className="text-green-950">{username}</p>
          </div>
          <label className="cursor-pointer">
            <div className="w-16 h-16 mt-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={profilePhotoPreview || "https://via.placeholder.com/100"} // Placeholder for image
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              onChange={handleImageUpload}
              type="file"
              id="profilePicture"
              className="hidden"
              accept="image/*"
            />
          </label>
          {/* Other input fields */}

          <div className="mt-2 p-4">
            <label className="text-slate-900">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-200 mt-1 p-2 h-7 rounded-sm focus:outline-none  placeholder:text-sm"
              type="text"
              placeholder="Enter Name"
            />
          </div>

          <div className="mt-[-20px] p-4">
            <label className="text-slate-900">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-200 mt-1 p-2 h-7 rounded-sm focus:outline-none  placeholder:text-sm"
              type="text"
              placeholder="Enter Name"
            />
          </div>

          <div className="mt-[-20px] p-4 w-full">
            <label className="text-slate-900">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-slate-200 mt-1 p-1 h-7 rounded-sm focus:outline-none text-sm w-full"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mt-[-20px] p-4">
            <label className="text-slate-900">Date of Birth</label>
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-slate-200 mt-1 p-2 h-7 rounded-sm focus:outline-none  placeholder:text-sm w-full  placeholder-gray-500"
              type="date"
              placeholder="Enter DOB"
            />
          </div>
          <div className="mt-[-20px] p-4">
            <label className="text-slate-900">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-200 mt-1 p-2 h-7 rounded-sm focus:outline-none  placeholder:text-sm"
              type="password"
              placeholder="Enter Password"
            />
          </div>

          <div className="mt-2">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-800 px-3 py-1 text-white rounded-md"
            >
              Back
            </button>
            <button
              onClick={handleRegister}
              className="bg-slate-800 px-3 py-1 text-white rounded-md ml-2"
            >
              Register
            </button>
          </div>
          <div className="text-sm my-3">
            Already have an accound?{" "}
            <span className="text-sky-700 cursor-pointer hover:underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;