import Head from "next/head";
import React from "react";

const PageNotFound = () => {
  return (
    <>
      <Head>
        <title>VTJoho - 404</title>
      </Head>
      <div className="flex h-full flex-col items-center justify-center px-4">
        <h2 className="bg-gradient-to-r from-red-600 to-teal-500 bg-clip-text text-[80px] font-bold text-transparent">
          404
        </h2>
        <h3 className="text-[30px]">Page not found</h3>
        <p className="my-5 text-[16px]">
          The page you are looking for doesn&apos;t exist or an other error occurred.
        </p>
      </div>
    </>
  );
};

export default PageNotFound;
