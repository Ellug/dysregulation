importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Firebase 초기화 (당신 프로젝트 firebaseConfig에 맞게 수정)
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

// Firebase Messaging 인스턴스 가져오기
const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 FCM 수신:', payload);

  const notificationTitle = payload.notification?.title || '새 메시지';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 채팅이 도착했습니다.',
    icon: 'google-sheets', // 원하는 아이콘 경로
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
