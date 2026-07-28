"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action="/logout" method="post" className={className}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" size="sm" disabled={pending}>
      <LogOut aria-hidden className="h-4 w-4" />
      {pending ? "Выходим..." : "Выйти"}
    </Button>
  );
}
