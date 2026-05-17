import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, serverTimestamp, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out', error);
        throw error;
    }
};

// Error handling helper required by instructions
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const savePacket = async (packet: any) => {
    try {
        const user = auth.currentUser;
        if (!user) return; // Only save to firestore if logged in

        const packetId = Date.now().toString();
        const path = `users/${user.uid}/packets/${packetId}`;
        const ref = doc(db, path);
        
        await setDoc(ref, {
            ...packet,
            userId: user.uid,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'users/{uid}/packets/{id}');
    }
}

export const getPackets = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const path = `users/${user.uid}/packets`;
        const q = query(collection(db, path), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'users/{uid}/packets');
        return [];
    }
}
