import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
            rel="stylesheet"
          />
        </Head>
        {/* NextJS에서 폰트를 쓸 땐 구글폰트 사용하기. 구글폰트를 기반으로 최적화되어있기 때문 */}
        <body>
          <Main />
          {/* Main을 렌더링할 때 _app.tsx 실행 */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

// _app.tsx는 유저가 페이지를 불러올 때마다 브라우저에서 실행
// _document.tsx는 서버에서 한 번만 실행
