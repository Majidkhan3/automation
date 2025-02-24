import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "src/utils/createEmotionCache";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="emotion-insertion-point" content="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <Script
            id="widget-settings"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.widgetSettings2 = ${JSON.stringify({
                  bottomPadding: 0,
                  sidePadding: 0,
                  widgetPosition: "right",
                  widgetSize: 80,
                  OpenPopup: true,
                  showPopup: true,
                  popupText: "Chat with us",
                  popupdesc: "Click One Of Ours Represent",
                  showTooltip: true,
                  tooltipText: "",
                  url: "",
                  disabled: false,
                  widgetType: "WhatsApp",
                  widgetHandle: "+923044735162",
                  btnStyle: "1",
                  notification: 5,
                  btnColor: "#420d4d",
                  btnTitle: "Need help?",
                  btnMobileLink: "https://wa.me/YOUR_PHONE_NUMBER/?text=Hi",
                  btnDesktopLink:
                    "https://web.whatsapp.com/send?phone=YOUR_PHONE_NUMBER&text=Hi",
                  btnDescription: "Chat with us",
                  popupBackground: "#492222",
                  chromeTitle: undefined,
                  targetingRules: [
                    {
                      id: "1",
                      path: "test",
                      rule: "pages-that-contain",
                      show: true,
                    },
                  ],
                  person: [
                    {
                      id: 1,
                      avatarImage:
                        "https://www.w3schools.com/howto/img_avatar.png",
                      open: false,
                      avatarColor: "#0fa",
                      personTitle: "Lorna Hensley (Sample)",
                      personDesc: "Sales Support",
                      buttonOnline: "I am Online",
                      buttonOffline: "I will Be back soon",
                      desktopLink: "https://desktop.com",
                      mobileLink: "https://mobile.com",
                      online: true,
                      onlineDays: {
                        Monday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Tuesday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Wednesday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Thursday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Friday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Saturday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                        Sunday: {
                          isOnline: true,
                          time: { startTime: "00:00", endTime: "23:59" },
                        },
                      },
                    },
                  ],
                })};
              `,
            }}
          /> */}
          <Script
            src="/widget.js" // Ensure the path is correct relative to the public folder
            strategy="afterInteractive"
            onLoad={() => {
              // Access widgetSettings2 from the global scope
              // if (typeof window !== "undefined" && window.widgetSettings2) {
              initializeWidget(widgetSettings2);
              // } else {
              //   console.error("widgetSettings2 is not defined.");
              // }
            }}
          />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
