import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="title" content="VTJoho" />
        <meta
          name="description"
          content="VTJoho is a website about virtual YouTuber (VTuber) that provides various information about VTubers."
        />
        <meta name="keywords" content="Vtuber, Virtual YouTuber" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
