
import React, { useState } from "react";
import SignupDoctor from "./SignupDoctor";
import SignupClinical from "./SignupClinical";
import SignupAdmin from "./SignupAdmin";
import "../styles/signup.css"; // Make sure you have styles for the signup

function Signup() {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="signup-container">
      <h2>Signup Page</h2>
      <div className="role-selection">
        <label>
          <input
            type="radio"
            value="doctor"
            checked={selectedRole === "doctor"}
            onChange={handleRoleChange}
          />
          Doctor
        </label>
        <label>
          <input
            type="radio"
            value="clinical"
            checked={selectedRole === "clinical"}
            onChange={handleRoleChange}
          />
          Clinical Staff
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={selectedRole === "admin"}
            onChange={handleRoleChange}
          />
          Admin
        </label>
      </div>

      {selectedRole === "doctor" && <SignupDoctor />}
      {selectedRole === "clinical" && <SignupClinical />}
      {selectedRole === "admin" && <SignupAdmin />}
    </div>
  );
}

export default Signup;