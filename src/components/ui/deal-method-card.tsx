import { ShieldCheck, UserRoundCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEAL_METHOD_DESCRIPTIONS, DEAL_METHOD_LABELS } from "@/lib/constants";
import type { DealMethod } from "@/types";
import { cn } from "@/lib/utils";

const icons = {
  PERSONAL_MEETING: UserRoundCheck,
  DIRECT: Zap,
  SAFE_DEAL: ShieldCheck,
};

export function DealMethodCard({
  method,
  active = false,
  disabled = false,
  onClick,
}: {
  method: DealMethod;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Icon = icons[method];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "min-h-32 rounded-[8px] border border-black/10 bg-white p-4 text-left transition hover:border-black/20 hover:bg-[#f6f6f4] disabled:cursor-not-allowed disabled:opacity-55",
        active && "border-black bg-lime/20",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f1f1ef] text-black">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <Badge variant={method === "SAFE_DEAL" ? "warning" : "neutral"}>
          {method === "SAFE_DEAL" ? "Скоро" : "Доступно"}
        </Badge>
      </div>
      <h3 className="text-sm font-semibold text-black">{DEAL_METHOD_LABELS[method]}</h3>
      <p className="mt-2 text-sm leading-5 text-black/58">
        {DEAL_METHOD_DESCRIPTIONS[method]}
      </p>
    </button>
  );
}
