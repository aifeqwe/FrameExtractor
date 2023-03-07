import PushNotification from "react-native-push-notification";

class NotificationService {
  configure = (onRegister, onNotification, onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        onRegister(token);
      },
      onNotification: function (notification) {
        onNotification(notification);
        if (notification.userInteraction) {
          onOpenNotification(notification);
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  localNotification = (title, message) => {
    PushNotification.localNotification({
      title: title,
      message: message,
      playSound: true,
      soundName: "default",
      vibrate: true,
      vibration: 300,
    });
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeAllDeliveredNotifications = () => {
    PushNotification.removeAllDeliveredNotifications();
  };
}

export const notificationService = new NotificationService();