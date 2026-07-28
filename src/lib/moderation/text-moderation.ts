import { ruModerationAllowList, ruModerationDictionary, type ModerationCategory } from "./dictionaries/ru";

export const MODERATION_ERROR_MESSAGE =
  "Текст содержит запрещённые слова. Измени его и попробуй снова.";

type ModerationMatch = {
  category: ModerationCategory;
};

type ModerationResult = {
  ok: boolean;
  matches: ModerationMatch[];
};

const LOOKALIKE_MAP: Record<string, string> = {
  a: "а",
  c: "с",
  e: "е",
  k: "к",
  m: "м",
  o: "о",
  p: "р",
  t: "т",
  x: "х",
  y: "у",
  0: "о",
  3: "з",
  4: "ч",
  "@": "а",
  $: "с",
};

export function normalizeForModeration(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[acekmoptxy034@$]/g, (char) => LOOKALIKE_MAP[char] ?? char)
    .replace(/\s+/g, " ")
    .trim();
}

function compact(value: string) {
  return value.replace(/[\s.\-_]+/g, "");
}

function removeAllowListedTerms(value: string) {
  return ruModerationAllowList.reduce(
    (current, term) => current.replaceAll(normalizeForModeration(term), " "),
    value,
  );
}

function hasTerm(haystack: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "u").test(haystack);
}

export function moderateText(value: string): ModerationResult {
  const normalized = removeAllowListedTerms(normalizeForModeration(value));
  const compacted = compact(normalized);

  const matches: ModerationMatch[] = [];

  for (const [category, terms] of Object.entries(ruModerationDictionary) as Array<
    [ModerationCategory, string[]]
  >) {
    for (const term of terms) {
      const normalizedTerm = normalizeForModeration(term);
      const compactedTerm = compact(normalizedTerm);

      if (hasTerm(normalized, normalizedTerm) || compacted.includes(compactedTerm)) {
        matches.push({ category });
        break;
      }
    }
  }

  return {
    ok: matches.length === 0,
    matches,
  };
}

export function assertModeratedText(value: string) {
  const result = moderateText(value);

  if (!result.ok) {
    return MODERATION_ERROR_MESSAGE;
  }

  return null;
}
