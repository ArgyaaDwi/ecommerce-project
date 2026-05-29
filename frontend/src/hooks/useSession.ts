import { useState, useEffect } from "react";
import { API_URL } from "../lib/utils";
import type { SessionResponse } from "@/types/interface";

export const useSession = () => {
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  useEffect(() => {
    const initSession = async () => {
      let key = localStorage.getItem("sessionKey");

      if (!key) {
        try {
          const randomName = `User-${Math.floor(Math.random() * 10000)}`;
          const res = await fetch(`${API_URL}/user/create_session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: randomName,
            }),
          });

          const data = (await res.json()) as SessionResponse;

          if (data.success) {
            key = data.data.sessionKey;
            localStorage.setItem("sessionKey", key);
          }
        } catch (error) {
          console.error("Gagal membuat session:", error);
        }
      }
      setSessionKey(key);
      setIsLoadingSession(false);
    };

    initSession();
  }, []);

  return { sessionKey, isLoadingSession };
};
