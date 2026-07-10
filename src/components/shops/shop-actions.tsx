"use client";

import { Bell, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShopActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        onClick={() => toast("Demo: подписка пока не создает реальную связь в базе.")}
      >
        <Bell aria-hidden className="h-4 w-4" />
        Подписаться
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => toast("Сообщения пока заглушка. Нужны auth, сервер и rate limiting.")}
      >
        <MessageCircle aria-hidden className="h-4 w-4" />
        Сообщение
      </Button>
    </div>
  );
}
