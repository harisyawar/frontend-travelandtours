// src/components/AuthGuard.jsx
"use client";

import { useAtom } from "jotai";
import { userAtom } from "@/store/atoms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AuthGuard({ children, protectedRoutes }) {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const path = router.pathname;

    // agar ye route protected hai aur user login nahi
    if (protectedRoutes.includes(path) && !user) {
      router.replace("/Error"); // ya "/login"
    } else {
      setChecked(true);
    }
  }, [user, router, protectedRoutes]);

  if (!checked) return null; // loader ya blank screen

  return <>{children}</>;
}
