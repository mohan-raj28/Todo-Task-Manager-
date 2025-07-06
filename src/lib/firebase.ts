// Firebase config and initialization for social login
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCpWOPnfYrhyxfEeg9y1lm7P-czMB7oCG0",
  authDomain: "todo-task-manager-226c2.firebaseapp.com",
  projectId: "todo-task-manager-226c2",
  storageBucket: "todo-task-manager-226c2.appspot.com",
  messagingSenderId: "349774352197",
  appId: "1:349774352197:web:1a8ddc310c7ffa9425f82c",
  measurementId: "G-0SZ3W0T38H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const logout = () => signOut(auth);

// Firestore helpers for user-specific tasks
export const getUserTasks = async (userId: string) => {
  const q = query(collection(db, `users/${userId}/tasks`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUserTask = async (userId: string, task: any) => {
  return await addDoc(collection(db, `users/${userId}/tasks`), task);
};

export const updateUserTask = async (userId: string, taskId: string, task: any) => {
  return await setDoc(doc(db, `users/${userId}/tasks`, taskId), task);
};

export const deleteUserTask = async (userId: string, taskId: string) => {
  return await deleteDoc(doc(db, `users/${userId}/tasks`, taskId));
};
