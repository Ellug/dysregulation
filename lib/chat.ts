import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ChatMessage {
  id: string;
  uid: string;
  text: string;
  createdAt: Timestamp; // Timestamp
}

export async function sendMessage(uid: string, text: string) {
  if (!text.trim()) return;
  await addDoc(collection(db, "prototype"), {
    uid,
    text,
    createdAt: serverTimestamp(),
  });
}

export async function fetchInitialMessages(limitCount = 20) {
  const ref = collection(db, "prototype");
  const q = query(ref, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  const messages: ChatMessage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
  const last = snapshot.docs[snapshot.docs.length - 1];
  return { messages, lastVisible: last };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMoreMessages(lastVisibleDoc: any, limitCount = 20) {
  const ref = collection(db, "prototype");
  const q = query(ref, orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(limitCount));
  const snapshot = await getDocs(q);
  const messages: ChatMessage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
  const last = snapshot.docs[snapshot.docs.length - 1];
  return { messages, lastVisible: last };
}

export function subscribeToMessages(callback: (message: ChatMessage) => void) {
  const ref = collection(db, "prototype");
  const q = query(ref, orderBy("createdAt", "desc"), limit(1));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const data = change.doc.data();
        callback({ id: change.doc.id, ...data } as ChatMessage);
      }
    });
  });
}