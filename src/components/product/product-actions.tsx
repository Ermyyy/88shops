"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { startConversationAction } from "@/lib/message-actions";

type ProductActionsProps = {
  productId: string;
  isAuthenticated?: boolean;
};

export function ProductActions({ productId, isAuthenticated = true }: ProductActionsProps) {
  const handleAuthRedirect = () => {
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {isAuthenticated ? (
        <form action={startConversationAction}>
          <input type="hidden" name="productId" value={productId} />
          <Button type="submit" className="w-full">
            <MessageCircle aria-hidden className="h-4 w-4" />
            Написать продавцу
          </Button>
        </form>
      ) : (
        <Button type="button" onClick={handleAuthRedirect} className="w-full">
          <MessageCircle aria-hidden className="h-4 w-4" />
          Написать продавцу
        </Button>
      )}
      <FavoriteButton
        productId={productId}
        label="В избранное"
        className="w-full"
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
