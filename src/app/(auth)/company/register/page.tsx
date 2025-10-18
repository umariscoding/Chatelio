"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/company/auth");
  }, [router]);

  return null;
}
