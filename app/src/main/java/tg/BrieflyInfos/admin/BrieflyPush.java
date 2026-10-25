package tg.BrieflyInfos.admin;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.annotation.NonNull;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

/**
 * Gestionnaire du jeton Firebase Cloud Messaging (FCM).
 * Permet la réception des notifications push même lorsque l'application est en arrière-plan ou fermée.
 */
public final class BrieflyPush {

    private static final String TAG = "BrieflyPush";
    public static final String PREFS = "briefly_admin_prefs";
    public static final String TOKEN_KEY = "fcm_push_token";
    public static final String TOPIC_ADMIN = "admin_alerts";

    private BrieflyPush() {}

    /**
     * Initialise les abonnements FCM (notamment au topic admin_alerts).
     */
    public static void initialize(final Context context) {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(TOPIC_ADMIN)
                    .addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if (task.isSuccessful()) {
                                Log.d(TAG, "Abonné avec succès au topic : " + TOPIC_ADMIN);
                            } else {
                                Log.w(TAG, "Échec de l'abonnement au topic", task.getException());
                            }
                        }
                    });

            FirebaseMessaging.getInstance().getToken()
                    .addOnCompleteListener(new OnCompleteListener<String>() {
                        @Override
                        public void onComplete(@NonNull Task<String> task) {
                            if (!task.isSuccessful() || task.getResult() == null) {
                                Log.w(TAG, "Impossible de récupérer le jeton FCM", task.getException());
                                return;
                            }
                            storeToken(context, task.getResult());
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Erreur lors de l'initialisation de Firebase", e);
        }
    }

    public static void storeToken(Context context, String token) {
        if (token == null || token.isEmpty()) return;
        SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        prefs.edit().putString(TOKEN_KEY, token).apply();
        Log.i(TAG, "Jeton FCM sauvegardé localement");
    }

    public static String getToken(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(TOKEN_KEY, "");
    }
}
