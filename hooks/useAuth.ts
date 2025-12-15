"use client";
import { useState } from "react";

export default function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => typeof window !== "undefined" ? localStorage.getItem("krix_token") : null);

  function setToken(t: string | null) {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("krix_token", t);
      else localStorage.removeItem("krix_token");
    }
    setTokenState(t);
  }

  return { token, setToken };
}
