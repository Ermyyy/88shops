"use client";

import { Bell, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ShopActionsProps = {
  isAuthenticated?: boolean;
};

export function ShopActions({ isAuthenticated = false }: ShopActionsProps) {
  const handleAction = (message: string) => {
    if (!isAuthenticated) {
      const callbackUrl = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    toast(message);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        onClick={() => handleAction("Подписки скоро появятся.")}
      >
        <Bell aria-hidden className="h-4 w-4" />
        Подписаться
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleAction("Чат скоро появится.")}
      >
        <MessageCircle aria-hidden className="h-4 w-4" />
        Сообщение
      </Button>
    </div>
  );
}
