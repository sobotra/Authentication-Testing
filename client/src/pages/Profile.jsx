import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {user.isVerified ? "Verified" : "Not Verified"}
        </p>
      </div>
      <button onClick={logout} className="btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Profile;
