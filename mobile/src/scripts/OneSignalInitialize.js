import OneSignal from "react-native-onesignal";
import { env } from "../../environments";

export const oneSignalInitialize = () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(env.ONE_SIGNAL_APP_ID);

  OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData;
    console.log("additionalData: ", data);
    notificationReceivedEvent.complete(notification);
  });

  OneSignal.setNotificationOpenedHandler((notification) => {
    console.log("OneSignal: notification opened:", notification);
  });
};
