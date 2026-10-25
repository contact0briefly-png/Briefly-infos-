package tg.BrieflyInfos.admin;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service de réception des notifications push Firebase Cloud Messaging.
 * Affiche une alerte instantanée lorsque l'application reçoit un message de contact ou une mise à jour.
 */
public class BrieflyPushService extends FirebaseMessagingService {

    public static final String CHANNEL_ID = "tg.BrieflyInfos.admin.notifications";
    private static final AtomicInteger NOTIF_SEQ = new AtomicInteger(5000);

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        BrieflyPush.storeToken(this, token);
    }

    @Override
    public void onMessageReceived(RemoteMessage message) {
        super.onMessageReceived(message);

        Map<String, String> data = message.getData();
        String title = (message.getNotification() != null && message.getNotification().getTitle() != null)
                ? message.getNotification().getTitle()
                : (data.containsKey("title") ? data.get("title") : "Briefly Admin");

        String body = (message.getNotification() != null && message.getNotification().getBody() != null)
                ? message.getNotification().getBody()
                : (data.containsKey("body") ? data.get("body") : "Nouveau message reçu");

        String targetTab = data.containsKey("targetTab") ? data.get("targetTab") : "inbox";

        ensureChannel(this);

        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("target_tab", targetTab);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        int notificationId = NOTIF_SEQ.incrementAndGet();
        PendingIntent pendingIntent = PendingIntent.getActivity(this, notificationId, intent, flags);

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setColor(Color.parseColor("#2563EB"))
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setSound(soundUri)
                .setVibrate(new long[]{0, 250, 150, 250})
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        try {
            NotificationManagerCompat.from(this).notify(notificationId, builder.build());
        } catch (SecurityException ignored) {
            // Permission POST_NOTIFICATIONS non accordée
        }

        // Si l'application est ouverte, avertir le WebView
        BrieflyBridge bridge = BrieflyBridge.get();
        if (bridge != null) {
            bridge.notifyContactMessageReceived(title, body);
        }
    }

    public static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            NotificationChannel channel = nm.getNotificationChannel(CHANNEL_ID);
            if (channel == null) {
                channel = new NotificationChannel(
                        CHANNEL_ID,
                        context.getString(R.string.notification_channel_name),
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription(context.getString(R.string.notification_channel_desc));
                channel.enableLights(true);
                channel.setLightColor(Color.parseColor("#2563EB"));
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{0, 250, 150, 250});

                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .build();
                channel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), audioAttributes);

                nm.createNotificationChannel(channel);
            }
        }
    }
}
