"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function FlashToaster() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("profile") === "ready") {
      toast.success("Профиль готов");
    }
  }, [searchParams]);

  return null;
}
