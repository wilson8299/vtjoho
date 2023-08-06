import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { Header } from "@/components/shared";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
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
      <header className="fixed z-50 w-full">
        <Header />
      </header>
      <main className="scroll-behavior:smooth h-screen pt-[42px]">{children}</main>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Layout;
