"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/company/auth");
  }, [router]);

  return null;
}
