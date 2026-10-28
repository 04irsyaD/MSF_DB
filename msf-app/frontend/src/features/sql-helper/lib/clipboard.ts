import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { SQL_HELPER_LABELS } from "./labels";

/**
 * Enhanced copy handler with toast notifications.
 */
export async function copyScriptWithToast(
  sql: string,
  options: { successMsg?: string; errorMsg?: string } = {}
): Promise<boolean> {
  const success = await copyToClipboard(sql);
  if (success) {
    toast.success(options.successMsg || SQL_HELPER_LABELS.toast.copySuccess);
  } else {
    toast.error(options.errorMsg || SQL_HELPER_LABELS.toast.copyFailed);
  }
  return success;
}

export { copyToClipboard };
