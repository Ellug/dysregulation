importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Firebase 초기화 (당신 프로젝트 firebaseConfig에 맞게 수정)
firebase.initializeApp({
  apiKey: "AIzaSyDN_PhkNtHLI6S5ZiNc4WXXILFHxHklwsE",
  authDomain: "dysregulation-42fdd.firebaseapp.com",
  projectId: "dysregulation-42fdd",
  storageBucket: "dysregulation-42fdd.firebasestorage.app",
  messagingSenderId: "160656772306",
  appId: "1:160656772306:web:50eec5638d2252b23ef10b",
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