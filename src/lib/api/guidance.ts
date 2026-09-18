import { getApp } from "@react-native-firebase/app";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import type {
  GenerateGuidanceRequest,
  GenerateGuidanceResponse
} from "@/src/types/guidance";
import { bootstrapFirebase } from "@/src/lib/firebase/bootstrap";

function requestId(): string {
  return [
    Date.now().toString(36),
    Math.random().toString(36).slice(2, 10)
  ].join("-");
}

export async function generateGuidance(
  text: string,
  selectedCategoryId?: number
): Promise<GenerateGuidanceResponse> {
  await bootstrapFirebase();

  const functions = getFunctions(getApp());
  const callable = httpsCallable<
    GenerateGuidanceRequest,
    GenerateGuidanceResponse
  >(functions, "generateGuidance", {
    limitedUseAppCheckTokens: true
  });

  const result = await callable({
    text,
    selected_category_id: selectedCategoryId,
    client_request_id: requestId()
  });

  return result.data;
}
