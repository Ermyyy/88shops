"use server";

import "server-only";
import {
  completeOnboardingAction as completeOnboardingActionImpl,
  logoutAction as logoutActionImpl,
  signInWithGoogleAction as signInWithGoogleActionImpl,
  skipOnboardingAction as skipOnboardingActionImpl,
} from "@/lib/auth";
import type { AuthActionState, OnboardingActionState } from "@/lib/auth-types";

export async function signInWithGoogleAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return signInWithGoogleActionImpl(formData);
}

export async function logoutAction() {
  return logoutActionImpl();
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
