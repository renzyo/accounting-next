"use client";

import axios from "axios";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    const getLogout = async () => {
      try {
        const response = await axios.get("/api/auth/logout");
  
        if (response.status === 200) {
          window.location.assign("/");
        }
      } catch (error) {
        console.log("Something went wrong");
      }
    };

    getLogout();
  }, []);
  
  return null
}

export default Logout