package com.clipsync;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;

import javax.annotation.Nonnull;

public class ClipsyncModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Clipsync";
    private static ReactApplicationContext reactContext;

    public ClipsyncModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        ClipsyncModule.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        reactContext.startService(new Intent(reactContext, ClipsyncService.class));
    }

    @ReactMethod
    public void stopService() {
        reactContext.stopService(new Intent(reactContext, ClipsyncService.class));
    }

    @ReactMethod
    public void getClipboardContent(Callback successCallback, Callback errorCallback) {
        try {
            ClipboardManager clipboard = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                clipboard = (ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
            }

            if (clipboard != null && clipboard.hasPrimaryClip()) {
                ClipData.Item item = Objects.requireNonNull(clipboard.getPrimaryClip()).getItemAt(0);
                String content = item.getText().toString();
                successCallback.invoke(content);
            } else {
                successCallback.invoke(""); // Clipboard is empty
            }
        } catch (Exception e) {
            errorCallback.invoke("GET_CLIPBOARD_ERROR", e.getMessage());
        }
    }
}