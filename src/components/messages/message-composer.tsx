"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessageAction, type SendMessageState } from "@/lib/message-actions";

type MessageComposerProps = {
  conversationId: string;
};

const initialState: SendMessageState = {};

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [state, formAction] = useActionState(sendMessageAction, initialState);

  return (
    <form action={formAction} className="border-t border-black/10 bg-white p-3">
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex items-end gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Сообщение</span>
          <textarea
            name="text"
            required
            maxLength={3000}
            rows={2}
            className="max-h-40 min-h-12 w-full resize-none rounded-[10px] border border-black/10 bg-[#f6f6f4] px-3 py-2 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/30"
            placeholder="Напиши сообщение"
          />
        </label>
        <SubmitButton />
      </div>
      {state.error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Отправить">
      <Send aria-hidden className="h-4 w-4" />
    </Button>
  );
}
