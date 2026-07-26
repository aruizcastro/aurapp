package io.github.aruizcastro.aurapp;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

/**
 * The whole app is the web app, running in one WebView.
 *
 * Two decisions worth knowing about:
 *
 * 1. The files are served through WebViewAssetLoader, at
 *    https://appassets.androidplatform.net/, rather than loaded from file://.
 *    A file:// page is treated as an opaque origin, and localStorage — where
 *    every drawing, every dressed-up pet and the parent's PIN live — behaves
 *    badly or not at all there depending on the Android version. Served over
 *    the loader's https origin it is an ordinary, stable origin.
 *
 * 2. There is no INTERNET permission in the manifest, and nothing here asks
 *    for one. This build has no videos, so the app genuinely never touches the
 *    network. That is worth more than convenience: it makes the Play data
 *    safety form honest and trivial, and it means no request can leave a
 *    four-year-old's tablet even by accident.
 */
public class MainActivity extends AppCompatActivity {

    private WebView web;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage and IndexedDB
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setAllowFileAccess(false);           // the loader does the serving
        s.setAllowContentAccess(false);
        s.setTextZoom(100);                    // the system font size must not reflow the games

        // Nothing to select, nothing to long-press: this is a game board, not a page.
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> true);
        web.setHapticFeedbackEnabled(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            /**
             * Every page in this app is one of ours. Anything else — a link that
             * somehow ends up in a drawing, a stray redirect — is refused rather
             * than opened. There is no browser to escape into.
             */
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"appassets.androidplatform.net".equals(request.getUrl().getHost());
            }
        });

        /*
         * Back goes up one level inside the app, and closes it only from the
         * home screen — the behaviour Android users expect, and the one Play
         * reviewers check.
         *
         * Keeping a small child inside the app is not this button's job: that
         * is what screen pinning is for, and the help screen explains how to
         * turn it on. A back button that never works would be a worse app for
         * the parent without actually stopping the child.
         */
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                web.evaluateJavascript(
                        "(typeof go === 'function' && typeof current !== 'undefined' " +
                        "&& current !== 'worlds') ? (go('worlds'), 'up') : 'exit'",
                        value -> {
                            if (value != null && value.contains("exit")) finish();
                        });
            }
        });

        web.loadUrl("https://appassets.androidplatform.net/assets/www/index.html");
    }

    @Override
    protected void onResume() {
        super.onResume();
        goFullScreen();
        // She is watching and touching, not typing; the screen must not dim on her.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    /*
     * Deliberately not re-hiding the bars here. Re-asserting full screen on
     * every focus change is what makes an app fight the person using it: they
     * swipe the bar up, the app hides it again, and the Home button never gets
     * pressed. The bars come back full screen on the next onResume, which is
     * the moment she comes back to play.
     */

    /**
     * Full screen, but not a trap.
     *
     * This used to use IMMERSIVE_STICKY, and that is why the phone's Home
     * button needed pressing several times: with sticky immersive mode the
     * navigation bar is hidden, the first press only makes it reappear for a
     * moment, and only the second one actually reaches Home. It feels like the
     * phone is ignoring you.
     *
     * Plain IMMERSIVE reveals the bars on the first swipe or press and leaves
     * them there until the app is resumed again. The game still opens full
     * screen; a grown-up who wants out gets out on the first try.
     *
     * Keeping her inside the app is screen pinning's job, not this flag's.
     */
    private void goFullScreen() {
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE);
    }

    @Override
    protected void onDestroy() {
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
