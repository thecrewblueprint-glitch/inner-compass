import { createHash } from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";

function bucketKey(now = new Date()): string {
  return [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
    String(now.getUTCHours()).padStart(2, "0")
  ].join("");
}

function pseudonymousKey(uid: string): string {
  return createHash("sha256").update(uid).digest("hex");
}

export async function enforceRateLimit(
  uid: string,
  maxPerHour: number
): Promise<void> {
  const db = getFirestore();
  const key = `${pseudonymousKey(uid)}_${bucketKey()}`;
  const ref = db.collection("quotaCounters").doc(key);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const count = snapshot.exists
      ? Number(snapshot.data()?.count ?? 0)
      : 0;

    if (count >= maxPerHour) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    transaction.set(
      ref,
      {
        count: count + 1,
        bucket: bucketKey()
      },
      { merge: true }
    );
  });
}
