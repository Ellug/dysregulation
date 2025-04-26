import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";

const VAPID_KEY = "BBczKbNAfoI2mWFEogQ67ceIWfDfA6_z8e7sxugc8F5scF8hST7e8k5cuKaBO2wHTlgBHnb3R67Pk-vT51YItBg";

export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("알림 권한 거부됨");
      return null;
    }

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    console.log("FCM 토큰:", token);
    return token;
  } catch (error) {
    console.error("FCM 토큰 가져오기 실패:", error);
    return null;
  }
};
