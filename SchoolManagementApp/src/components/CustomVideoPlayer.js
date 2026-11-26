// src/components/CustomVideoPlayer.js

import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const CustomVideoPlayer = ({
    videoId,
    playing,
    onStateChange,
    height,
    width,
}) => {

    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // Stable YouTube embed URL
    // Removed:
    // - origin
    // - widgetid
    // - youtube-nocookie
    // - enablejsapi
    // These commonly cause error 153

    const embedUrl = `
        https://www.youtube.com/embed/${videoId}
        ?playsinline=1
        &rel=0
        &controls=0
        &fs=0
        &iv_load_policy=3
        &modestbranding=1
    `;

    // Play / Pause handling
    useEffect(() => {

        if (!webViewRef.current) return;

        const script = `
            (function() {
                try {

                    var video = document.querySelector('video');

                    if(video){

                        ${playing ? `
                            var playPromise = video.play();

                            if (playPromise !== undefined) {
                                playPromise.catch(function(){});
                            }
                        ` : `
                            video.pause();
                        `}
                    }

                } catch(e){}
            })();

            true;
        `;

        webViewRef.current.injectJavaScript(script);

    }, [playing]);

    // Lightweight styling only
    const injectedJavaScript = `
        (function() {

            try {

                var style = document.createElement('style');

                style.innerHTML = \`
                
                    body{
                        margin:0 !important;
                        padding:0 !important;
                        overflow:hidden !important;
                        background:black !important;
                    }

                    html{
                        background:black !important;
                    }

                    iframe{
                        border:none !important;
                    }

                    .ytp-chrome-top,
                    .ytp-watermark,
                    .ytp-share-button,
                    .ytp-watch-later-button,
                    .ytp-title,
                    .ytp-youtube-button,
                    .ytp-large-play-button {
                        display:none !important;
                        opacity:0 !important;
                        visibility:hidden !important;
                    }

                \`;

                document.head.appendChild(style);

            } catch(e){}

            true;

        })();
    `;

    return (
        <View
            style={[
                styles.container,
                {
                    height,
                    width,
                }
            ]}
        >

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />
                </View>
            )}

            <WebView
                ref={webViewRef}
                source={{
                    uri: embedUrl.replace(/\s/g, '')
                }}

                injectedJavaScript={injectedJavaScript}

                javaScriptEnabled={true}
                domStorageEnabled={true}

                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}

                scrollEnabled={false}
                bounces={false}

                overScrollMode="never"

                mixedContentMode="always"

                allowsFullscreenVideo={false}

                style={{
                    backgroundColor: 'black',
                    opacity: loading ? 0 : 1,
                }}

                onLoadStart={() => {
                    setLoading(true);
                }}

                onLoadEnd={() => {

                    setLoading(false);

                    if (onStateChange) {
                        onStateChange('ready');
                    }
                }}

                onError={(syntheticEvent) => {

                    const { nativeEvent } = syntheticEvent;

                    console.log('WebView Error:', nativeEvent);

                    setLoading(false);

                    if (onStateChange) {
                        onStateChange('error');
                    }
                }}

                originWhitelist={['*']}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'black',
        overflow: 'hidden',
        position: 'relative',
    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'black',

        zIndex: 999,
    },

});

export default CustomVideoPlayer;