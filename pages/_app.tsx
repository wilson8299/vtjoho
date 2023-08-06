import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Inter } from "@next/font/google";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NextPage } from "next/types";
import { supabase } from "@/query/supabaseClient";
import { Layout } from "@/components/shared";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/rgl.css";

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const inter = Inter({
  subsets: ["latin"],
});

const FontFamily: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={inter.className}>{children}</div>;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <FontFamily>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <NextNProgress height={5} options={{ showSpinner: false }} />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </FontFamily>
        </Hydrate>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;
