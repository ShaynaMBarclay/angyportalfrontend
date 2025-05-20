import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth"; 

function Dashboard() {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [grievance, setGrievance] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Logout function
  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  //change password 
function changePassword(newPassword) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    updatePassword(user, newPassword)
      .then(() => {
        alert("Password updated successfully.");
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          alert("Please log in again and try.");
        } else {
          alert("Error updating password: " + error.message);
        }
      });
  } else {
    alert("No user is logged in.");
  }
}

  useEffect(() => {
    async function fetchTokenAndValidate() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          navigate("/");
          return;
        }

        const token = await user.getIdToken();
        localStorage.setItem("token", token);

        const res = await fetch("https://angyportalserver.onrender.com/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

       
        await res.json();
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      }
    }

    fetchTokenAndValidate();
  }, [navigate]);

  useEffect(() => {
    if (!partnerEmail) return;

    const token = localStorage.getItem("token");
    fetch(`https://angyportalserver.onrender.com/api/is-verified?email=${encodeURIComponent(partnerEmail)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setIsVerified(data.verified))
      .catch(err => console.error("Verification check failed:", err));
  }, [partnerEmail]);

  async function sendVerification() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://angyportalserver.onrender.com/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerEmail }),
      });
      const data = await res.json();
      setMessage(res.ok ? "Verification email sent!" : data.error || "Failed to send verification.");
       if (!res.ok) {
      console.log("Backend error details:", data.details);
    }
  } catch (err) {
    setMessage("Error: " + err.message);
  }
}

 async function submitGrievance() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("https://angyportalserver.onrender.com/api/send-grievance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ partnerEmail, grievance }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Grievance sent!" : data.error || "Failed to send grievance.");

    if (res.ok) {
      setGrievance("");  
    }
  } catch (err) {
    setMessage("Error: " + err.message);
  }
}

   return (
    <div className="dashboard-container">
      <div className="header-row">
        <h2>Dashboard</h2>
        <div className="button-group">
          <button className="change-password-button" onClick={() => setShowPasswordInput(!showPasswordInput)}>
            Change Password
          </button>
          <button onClick={logout} className="logout-button">🚪 Logout</button>
        </div>
      </div>

      {showPasswordInput && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={() => changePassword(newPassword)}>Submit New Password</button>
        </>
      )}

      <input
        type="email"
        placeholder="Partner's Email 💌"
        value={partnerEmail}
        onChange={(e) => setPartnerEmail(e.target.value)}
        disabled={isVerified}
      />

      {!isVerified && (
        <button onClick={sendVerification}>Send Verification Email</button>
      )}

      {isVerified ? (
        <>
          <textarea
            placeholder="Write your grievance 😤"
            value={grievance}
            onChange={(e) => setGrievance(e.target.value)}
          />
          <button onClick={submitGrievance}>Submit Grievance</button>
        </>
      ) : (
        <p>Please verify your partner's email to unlock the grievance form.</p>
      )}

      <p>{message}</p>
    </div>
  );
}

export default Dashboard;
