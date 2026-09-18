import fs from "node:fs";
import path from "node:path";
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment
} from "@firebase/rules-unit-testing";
import {
  deleteApp,
  initializeApp,
  type App
} from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  after,
  before,
  beforeEach,
  test
} from "node:test";
import assert from "node:assert/strict";
import { enforceRateLimit } from "../src/lib/rateLimit.js";

const PROJECT_ID = "demo-inner-compass";
let testEnv: RulesTestEnvironment;
let adminApp: App;

before(async () => {
  adminApp = initializeApp({ projectId: PROJECT_ID });

  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(
        path.resolve(process.cwd(), "../firestore.rules"),
        "utf8"
      )
    }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv.cleanup();
  await deleteApp(adminApp);
});

test("unauthenticated client cannot read or write Firestore", async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const ref = doc(db, "quotaCounters", "unauthenticated");

  await assertFails(getDoc(ref));
  await assertFails(setDoc(ref, { count: 1 }));
});

test("authenticated client still cannot read or write Firestore", async () => {
  const db = testEnv.authenticatedContext("client-user").firestore();
  const ref = doc(db, "quotaCounters", "authenticated");

  await assertFails(getDoc(ref));
  await assertFails(setDoc(ref, { count: 1 }));
});

test("Admin SDK can write server-owned operational state", async () => {
  const db = getAdminFirestore(adminApp);
  const ref = db.collection("quotaCounters").doc("server-owned");

  await ref.set({ count: 1, bucket: "test" });
  const snapshot = await ref.get();

  assert.equal(snapshot.exists, true);
  assert.equal(snapshot.data()?.count, 1);
});

test("hourly pseudonymous quota rejects the request after the configured limit", async () => {
  await enforceRateLimit("test-anonymous-uid", 2);
  await enforceRateLimit("test-anonymous-uid", 2);

  await assert.rejects(
    enforceRateLimit("test-anonymous-uid", 2),
    /RATE_LIMIT_EXCEEDED/
  );
});
