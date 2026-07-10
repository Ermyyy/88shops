"use client";

import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";

export function ProductActions({ productId }: { productId: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        type="button"
        onClick={() =>
          toast("Чат пока не подключен. В production нужен серверный auth и rate limiting.")
        }
      >
        <MessageCircle aria-hidden className="h-4 w-4" />
        Написать продавцу
      </Button>
      <FavoriteButton productId={productId} label="В избранное" className="w-full" />
    </div>
  );
}
