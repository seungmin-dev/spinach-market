import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-lg mx-auto mt-6">
        <Component {...pageProps} />
      </div>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload" // +beforeInteractive, afterInteractive
      />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          //onLoad : 외부스크립트가 다 다운로드 되어야지만 실행되는 함수
          // window.fbAsyncInit = function () {
          //   FB.init({
          //     appId: "your-app-id",
          //     autoLogAppEvents: true,
          //     xfbml: true,
          //     version: "v13.0",
          //   });
          // };
        }}
      />
    </SWRConfig>
  );
}

export default MyApp;
