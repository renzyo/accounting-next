"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Logout = () => {
  const t = useTranslations("Logout");

  useEffect(() => {
    const getLogout = async () => {
      try {
        const response = await axios.post("/api/auth/logout", {
          key: "static_key",
        });

        if (response.status === 200) {
          window.location.assign("/en/login");
        }
      } catch (error) {
        console.log(error);
        toast.error(t("logoutFailed"));
      }
    };

    getLogout();
  }, [t]);

  return null;
};

export default Logout;
