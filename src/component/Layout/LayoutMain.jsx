import { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const [pathname, setPathname] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPathname(window.location.pathname);
  }, []);

  // List of paths where we DON'T want navbar and footer
  const hideLayoutPaths = [
    "/",
    "/Search",
    "/login",
    "/signup",
    "/verify-otp",
    "/forget-password",
    "/verify-reset-otp",
    "/reset-password",
  ];
  const hideLayoutfooter = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forget-password",
    "/verify-reset-otp",
    "/reset-password",
  ];

  // During SSG/SSR, show both navbar and footer (safe default)
  // After mount, check pathname
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
