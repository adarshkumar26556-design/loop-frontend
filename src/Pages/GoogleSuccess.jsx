import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false); // Prevent double navigation

  useEffect(() => {
    // Prevent running twice
    if (hasNavigated.current) return;
    
    console.log("reachedddddd.........");
    
    const params = new URLSearchParams(window.location.search);
    console.log("params::", params);
    
    const token = params.get("token");
    console.log("token::", token);
    
    if (token) {
      localStorage.setItem("token", token); // Fixed typo: was "token2222::"
      hasNavigated.current = true;
      navigate("/profile", { replace: true });
    } else {
      hasNavigated.current = true;
      navigate("/login", { replace: true });
    }
  }, [navigate]); // Added navigate to dependencies

  return (
    <p role="status" aria-live="polite">
      Signing you in…
    </p>
  );
}