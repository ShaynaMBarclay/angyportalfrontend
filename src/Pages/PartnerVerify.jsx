import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function PartnerVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("Invalid or missing token.");
      return;
    }

    fetch(`https://angyportalserver.onrender.com/api/verify?token=${token}&email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVerified(true);
          setStatus("Thank you for verifying!");
        } else {
          setStatus(data.message || "Verification failed.");
        }
      })
      .catch(() => setStatus("Error verifying token."));
  }, [searchParams.get("token"), searchParams.get("email")]);

  if (verified) {
    return (
      <div className="container">
        <h1>Verification Successful</h1>
        <p>Thank you for verifying your email. You can now close this window.</p>
      </div>
    );
  }


  return (
    <div className="container">
      <h1>Partner Verification</h1>
      <p>{status}</p>
    </div>
  );
}

export default PartnerVerify;
