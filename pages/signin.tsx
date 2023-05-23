import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { Provider } from "@supabase/supabase-js";
import { BsGoogle, BsDiscord, BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { supabase } from "@/query/supabaseClient";
import { spinAnimation } from "@/styles/animation";
import "react-toastify/dist/ReactToastify.css";

interface IBaseProps {
  email: string | null;
  providers: string[] | null;
}

const Signin: React.FC<IBaseProps> = ({ email, providers }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOAuthSignin = async (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: string
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const providerListElement = [
    {
      name: "discord",
      Icon: FaDiscord,
      disabled: (email && providers?.indexOf("discord") !== -1) || false,
    },
    {
      name: "github",
      Icon: BsGithub,
      disabled: (email && providers?.indexOf("github") !== -1) || false,
    },
    {
      name: "google",
      Icon: BsGoogle,
      disabled: (email && providers?.indexOf("google") !== -1) || false,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-light-300 px-5 dark:bg-dark-300">
        <motion.span
          animate={{ rotate: 360 }}
          transition={spinAnimation}
          className="block h-24 w-24 rounded-full border-[1rem] border-t-[1rem] border-transparent border-t-primary"
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>VTJoho - signin</title>
      </Head>
      <div className="flex h-full flex-col items-center overflow-y-auto bg-light-300 pb-6 dark:bg-dark-300">
        <div className="w-full px-4 pt-[10%]">
          {email && (
            <>
              <h2 className="overflow-hidden text-ellipsis py-1 text-center text-2xl font-semibold sm:text-4xl">
                HI, {email}
              </h2>
              <div className="flex justify-center py-4">
                {providerListElement
                  .filter((provider) => provider.disabled)
                  .map((provider) => (
                    <span key={provider.name} className="mx-2">
                      <provider.Icon className="text-3xl text-primary" />
                    </span>
                  ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full px-4 pb-16 sm:w-2/3 md:w-1/2 lg:w-2/5">
          {email && (
            <button
              onClick={handleSignOut}
              className="ver w-full flex-grow rounded-md bg-primary px-5 py-2 text-lg text-white transition duration-150 ease-in-out hover:bg-sky-600"
            >
              Sign out
            </button>
          )}
        </div>
        <div className="w-full px-4 sm:w-2/3 md:w-1/2 lg:w-2/5">
          <h2 className="pb-8 text-center text-5xl font-semibold">Sign in</h2>
          <div className="flex flex-col gap-6">
            {providerListElement?.map((provider) => (
              <button
                key={provider.name}
                onClick={(e) => handleOAuthSignin(e, provider.name)}
                disabled={provider.disabled}
                className="flex-grow rounded-md bg-primary px-5 py-2 text-lg text-white transition duration-150 ease-in-out hover:bg-sky-600 disabled:bg-gray-400"
              >
                <provider.Icon className="mr-4 inline-block text-3xl" />
                Sign in with Google
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;

export const getServerSideProps = async (ctx: any) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user.email || null;
  const providers = session?.user.app_metadata.providers || null;

  return { props: { email, providers } };
};
