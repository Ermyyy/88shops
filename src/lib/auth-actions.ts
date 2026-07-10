"use server";

import "server-only";
import {
  completeOnboardingAction as completeOnboardingActionImpl,
  loginAction as loginActionImpl,
  registerAction as registerActionImpl,
  skipOnboardingAction as skipOnboardingActionImpl,
} from "@/lib/auth";
import type { AuthActionState, OnboardingActionState } from "@/lib/auth-types";

export async function registerAction(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return registerActionImpl(prevState, formData);
}

export async function loginAction(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return loginActionImpl(prevState, formData);
}

export async function completeOnboardingAction(
  prevState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  return completeOnboardingActionImpl(prevState, formData);
}

export async function skipOnboardingAction(formData: FormData) {
  return skipOnboardingActionImpl(formData);
}
