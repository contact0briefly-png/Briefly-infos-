package tg.BrieflyInfos.admin;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import java.util.concurrent.Executor;

public class MainActivity extends AppCompatActivity {

    private static final String ADMIN_URL = "https://briefly-lilac.vercel.app/admin/";
    private static final long BACK_PRESS_INTERVAL = 2000; // 2 secondes pour quitter

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private LinearLayout lockOverlay;
    private Button btnUnlock;

    private boolean isUnlocked = false;
    private long lastBackgroundTime = 0;
    private long lastBackPressTime = 0;

    private ValueCallback<Uri[]> fileUploadCallback;
    private ActivityResultLauncher<Intent> fileChooserLauncher;
    private ActivityResultLauncher<String> notificationPermissionLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupFileUpload();
        setupNotifications();
        setupWebView();
        setupBackNavigation();
        setupBiometricLock();

        // Initialisation de Firebase
        BrieflyPush.initialize(this);
        BrieflyPushService.ensureChannel(this);

        // Premier verrouillage au lancement
        lockApp();
    }

    private void initViews() {
        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        progressBar = findViewById(R.id.progressBar);
        lockOverlay = findViewById(R.id.lockOverlay);
        btnUnlock = findViewById(R.id.btnUnlock);

        btnUnlock.setOnClickListener(v -> promptBiometricAuthentication());

        swipeRefreshLayout.setColorSchemeResources(R.color.primary);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isUnlocked) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }

    /* ════════════════════════════════════════════════════════════════════════════
       1. SYSTÈME DE VERROUILLAGE BIOMÉTRIQUE / CODE DU TÉLÉPHONE
       ════════════════════════════════════════════════════════════════════════════ */

    public void lockApp() {
        isUnlocked = false;
        lockOverlay.setVisibility(View.VISIBLE);
        promptBiometricAuthentication();
    }

    private void unlockApp() {
        isUnlocked = true;
        lockOverlay.setVisibility(View.GONE);
    }

    private void setupBiometricLock() {
        btnUnlock.setOnClickListener(v -> promptBiometricAuthentication());
    }

    private void promptBiometricAuthentication() {
        BiometricManager biometricManager = BiometricManager.from(this);
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;

        int canAuth = biometricManager.canAuthenticate(authenticators);
        if (canAuth != BiometricManager.BIOMETRIC_SUCCESS) {
            // Pas de code ou biométrie configuré sur le téléphone : déverrouille automatiquement
            unlockApp();
            return;
        }

        Executor executor = ContextCompat.getMainExecutor(this);
        BiometricPrompt biometricPrompt = new BiometricPrompt(MainActivity.this, executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        unlockApp();
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        // Utilisateur a annulé ou erreur
                        lockOverlay.setVisibility(View.VISIBLE);
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        Toast.makeText(MainActivity.this, getString(R.string.lock_failed), Toast.LENGTH_SHORT).show();
                    }
                });

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle(getString(R.string.lock_title))
                .setSubtitle(getString(R.string.lock_subtitle))
                .setAllowedAuthenticators(authenticators)
                .build();

        biometricPrompt.authenticate(promptInfo);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Si l'application revient de l'arrière-plan après plus de 30 secondes, reverrouiller
        if (lastBackgroundTime > 0 && (System.currentTimeMillis() - lastBackgroundTime > 30_000)) {
            lockApp();
        }
        lastBackgroundTime = 0;
    }

    @Override
    protected void onPause() {
        super.onPause();
        lastBackgroundTime = System.currentTimeMillis();
    }

    /* ════════════════════════════════════════════════════════════════════════════
       2. GESTION DU BOUTON RETOUR DU TÉLÉPHONE
       ════════════════════════════════════════════════════════════════════════════ */

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (!isUnlocked) {
                    finish();
                    return;
                }

                // Demande au JavaScript si l'action retour a été traitée (tiroir fermé, modal fermé, retour aux stats)
                webView.evaluateJavascript(
                        "(function(){ try { return window.__brieflyBackPress ? String(window.__brieflyBackPress()) : 'false'; } catch(e){ return 'false'; } })()",
                        new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String value) {
                                boolean handledByJs = "true".equalsIgnoreCase(String.valueOf(value).replace("\"", ""));
                                if (handledByJs) {
                                    // La page web a traité le retour (fermé le menu ou revenu à la page d'accueil)
                                    return;
                                }

                                // Si l'historique WebView peut reculer
                                if (webView.canGoBack()) {
                                    webView.goBack();
                                    return;
                                }

                                // Nous sommes sur la page d'accueil (dash) : confirmation double-appui pour quitter
                                if (System.currentTimeMillis() - lastBackPressTime < BACK_PRESS_INTERVAL) {
                                    finish();
                                } else {
                                    lastBackPressTime = System.currentTimeMillis();
                                    Toast.makeText(MainActivity.this, getString(R.string.press_again_exit), Toast.LENGTH_SHORT).show();
                                }
                            }
                        }
                );
            }
        });
    }

    /* ════════════════════════════════════════════════════════════════════════════
       3. CONFIGURATION DU WEBVIEW & PASSERELLE NATIVE
       ════════════════════════════════════════════════════════════════════════════ */

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Pont JavaScript ⇄ Android
        webView.addJavascriptInterface(new BrieflyBridge(this, webView), BrieflyBridge.INTERFACE_NAME);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);

                // Injecter le jeton FCM si disponible
                String token = BrieflyPush.getToken(MainActivity.this);
                if (!token.isEmpty()) {
                    view.evaluateJavascript("if(window.__setNativeFcmToken){ window.__setNativeFcmToken('" + token + "'); }", null);
                }

                // Traiter les notifications ouvertes
                handleIntentNavigation(getIntent());
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                if (request.isForMainFrame() && !view.getUrl().startsWith("file:")) {
                    view.loadUrl("file:///android_asset/admin/index.html");
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    fileChooserLauncher.launch(intent);
                } catch (Exception e) {
                    fileUploadCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.loadUrl(ADMIN_URL);
    }

    private void setupFileUpload() {
        fileChooserLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (fileUploadCallback == null) return;
                    Uri[] results = null;
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        String dataString = result.getData().getDataString();
                        if (dataString != null) {
                            results = new Uri[]{Uri.parse(dataString)};
                        } else if (result.getData().getClipData() != null) {
                            int count = result.getData().getClipData().getItemCount();
                            results = new Uri[count];
                            for (int i = 0; i < count; i++) {
                                results[i] = result.getData().getClipData().getItemAt(i).getUri();
                            }
                        }
                    }
                    fileUploadCallback.onReceiveValue(results);
                    fileUploadCallback = null;
                }
        );
    }

    private void setupNotifications() {
        notificationPermissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                isGranted -> {
                    // Permission notif accordée ou refusée
                }
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS);
            }
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntentNavigation(intent);
    }

    private void handleIntentNavigation(Intent intent) {
        if (intent == null) return;
        String targetTab = intent.getStringExtra("target_tab");
        if (targetTab != null && !targetTab.isEmpty()) {
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                webView.evaluateJavascript("if(window.go){ window.go('" + targetTab + "'); }", null);
            }, 500);
        }
    }
}
