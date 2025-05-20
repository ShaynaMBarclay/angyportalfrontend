
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("https://angyportalserver.onrender.com/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setIsChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  if (isChecking) {
    return <p>Loading...</p>; 
  }

  return children;
}

export default ProtectedRoute;
