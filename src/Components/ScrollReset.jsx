import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
    document.body.style.zoom = "100%"; 
    document.body.style.transform = "scale(1)"; 
  }, [pathname]);

  return null;
}
