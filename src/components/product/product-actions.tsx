"use client";

import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";

type ProductActionsProps = {
  productId: string;
  isAuthenticated?: boolean;
};

export function ProductActions({ productId, isAuthenticated = true }: ProductActionsProps) {
  const handleMessage = () => {
    if (!isAuthenticated) {
      const callbackUrl = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    toast("Чат скоро появится.");
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" onClick={handleMessage}>
        <MessageCircle aria-hidden className="h-4 w-4" />
        Написать продавцу
      </Button>
      <FavoriteButton
        productId={productId}
        label="В избранное"
        className="w-full"
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
