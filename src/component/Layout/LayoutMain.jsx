import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get pathname safely - empty string before mount for SSG safety
  const pathname = mounted ? router.pathname : "";

  // List of paths where we DON'T want navbar and footer
  const hideLayoutPaths = [
    "/",
    "/Search",
    "/Login",
    "/Signup",
    "/verify-otp",
    "/Forget-password",
    "/verify-reset-otp",
    "/reset-password",
  ];
  const hideLayoutfooter = [
    "/Login",
    "/Signup",
    "/verify-otp",
    "/Forget-password",
    "/verify-reset-otp",
    "/reset-password",
  ];

  // Before mount: show everything (safe for SSG)
  // After mount: check pathname
  const showLayout = !mounted || !hideLayoutPaths.includes(pathname);
  const showLayoutFooter = !mounted || !hideLayoutfooter.includes(pathname);

  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayoutFooter && <Footer />}
    </>
  );
};

export default MainLayout;
