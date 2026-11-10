// إعدادات مشروع Firebase بتاع الصيدلية دي (من Firebase Console ← Project settings ← Your apps ← Web app).
// فاضي (null) = البرنامج بيطلّع رسالة «مفيش مشروع متوصل».
// ملحوظة: apiKey بتاع Firebase للويب مش سر (الحماية في قواعد Firestore)، بس برضه كل صيدلية ليها مشروعها الخاص.
// المشروع ده تجريبي (للعرض على العملاء): pharmacy-delivery-demo
export const firebaseConfig = {
  apiKey: "AIzaSyBmlKfOSzrL9FnKQZTDfIRojSFToyS-kqg",
  authDomain: "pharmacy-delivery-demo.firebaseapp.com",
  projectId: "pharmacy-delivery-demo",
  storageBucket: "pharmacy-delivery-demo.firebasestorage.app",
  messagingSenderId: "519144353233",
  appId: "1:519144353233:web:7e52cd7d8c958fbfd584f0"
};
