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
        "min-h-36 rounded-[8px] border border-white/10 bg-white/[0.045] p-5 text-left transition hover:border-lime/45 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-55",
        active && "border-lime/60 bg-lime/10",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-black/35 text-lime">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <Badge variant={method === "SAFE_DEAL" ? "warning" : "neutral"}>
          {method === "SAFE_DEAL" ? "Скоро" : "Доступно"}
        </Badge>
      </div>
      <h3 className="text-base font-semibold text-cream">{DEAL_METHOD_LABELS[method]}</h3>
      <p className="mt-2 text-sm leading-6 text-cream/55">
        {DEAL_METHOD_DESCRIPTIONS[method]}
      </p>
    </button>
  );
}
