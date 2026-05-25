const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let initialized = false;

function normalizeEnvValue(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function resolveServiceAccountPath(jsonPath) {
  const cleanPath = normalizeEnvValue(jsonPath);

  if (!cleanPath) {
    return null;
  }

  const candidates = path.isAbsolute(cleanPath)
    ? [cleanPath]
    : [
        path.resolve(process.cwd(), cleanPath),
        path.resolve(__dirname, '..', '..', cleanPath),
      ];

  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  return resolvedPath || candidates[0];
}

function parseServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const jsonPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (rawJson) {
    return JSON.parse(normalizeEnvValue(rawJson));
  }

  if (jsonPath) {
    return require(resolveServiceAccountPath(jsonPath));
  }

  return null;
}

function initializeFirebaseAdmin() {
  if (initialized) {
    return admin;
  }

  const serviceAccount = parseServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!serviceAccount) {
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || projectId,
  });

  initialized = true;
  return admin;
}

function isFirebaseConfigured() {
  try {
    return Boolean(initializeFirebaseAdmin());
  } catch (error) {
    return false;
  }
}

async function sendMulticastNotification(tokens, notification, data = {}) {
  const firebaseAdmin = initializeFirebaseAdmin();

  if (!firebaseAdmin) {
    throw new Error('Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.');
  }

  const cleanTokens = [...new Set((tokens || []).map((token) => String(token || '').trim()).filter(Boolean))];
  if (!cleanTokens.length) {
    return { successCount: 0, failureCount: 0, responses: [] };
  }

  const responses = [];
  let successCount = 0;
  let failureCount = 0;

  for (let index = 0; index < cleanTokens.length; index += 500) {
    const batchTokens = cleanTokens.slice(index, index + 500);
    const result = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: batchTokens,
      notification,
      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value == null ? '' : String(value)])
      ),
    });

    successCount += result.successCount;
    failureCount += result.failureCount;
    responses.push(...result.responses);
  }

  return { successCount, failureCount, responses };
}

module.exports = {
  initializeFirebaseAdmin,
  isFirebaseConfigured,
  sendMulticastNotification,
};