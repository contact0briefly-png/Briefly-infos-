package tg.BrieflyInfos.admin;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import org.json.JSONObject;

/**
 * Passerelle JavaScript ⇄ Android de l'application Briefly Admin.
 * Exposée directement dans le WebView sous l'objet window.BrieflyNative.
 */
public class BrieflyBridge {

    public static final String INTERFACE_NAME = "BrieflyNative";
    private static BrieflyBridge instance;

    private final MainActivity activity;
    private final WebView webView;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public BrieflyBridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        instance = this;
    }

    public static BrieflyBridge get() {
        return instance;
    }

    @JavascriptInterface
    public boolean isNativeApp() {
        return true;
    }

    @JavascriptInterface
    public String getFcmToken() {
        return BrieflyPush.getToken(activity);
    }

    @JavascriptInterface
    public void lockNow() {
        mainHandler.post(activity::lockApp);
    }

    @JavascriptInterface
    public void showToast(final String message) {
        if (message == null) return;
        mainHandler.post(() -> Toast.makeText(activity, message, Toast.LENGTH_SHORT).show());
    }

    @JavascriptInterface
    public void vibrate(long milliseconds) {
        try {
            Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null && v.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(Math.min(milliseconds, 1000), VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(Math.min(milliseconds, 1000));
                }
            }
        } catch (Exception ignored) {}
    }

    /**
     * Notifie la page web qu'un nouveau message de contact a été reçu via FCM.
     */
    public void notifyContactMessageReceived(final String title, final String body) {
        mainHandler.post(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("title", title);
                payload.put("body", body);
                String js = "if(window.__onBrieflyPushReceived){ window.__onBrieflyPushReceived(" + JSONObject.quote(payload.toString()) + "); }";
                webView.evaluateJavascript(js, null);
            } catch (Exception ignored) {}
        });
    }
}
