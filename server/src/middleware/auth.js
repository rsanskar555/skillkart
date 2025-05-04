import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Firebase service account key JSON file
const serviceAccountPath = path.join(__dirname, '../../firebaseServiceAccount.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
}

// Middleware to verify Firebase Auth token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Set user on request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'learner' // Default role
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Middleware to check if user is a curator
export const isCurator = (req, res, next) => {
  if (req.user && req.user.role === 'curator') {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden - Curator access required' });
};
