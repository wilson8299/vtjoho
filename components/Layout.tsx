import { ToastContainer } from "react-toastify";
import { Header } from "@/components";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
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

// import { ToastContainer } from "react-toastify";
// import { Header } from "@/components";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <>
//       <Header />
//       <main className="h-[calc(100vh-42px)]">{children}</main>
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// };

// export default Layout;
