import Footer from "./Footer";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

const MainLayout = ({ children }) => {
  const router = useRouter();

  // Safe pathname access - fallback to empty string during SSG
  const pathname = router.isReady ? router.pathname : "";

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
  // Determine if navbar and footer should show
  const showLayout = !hideLayoutPaths.includes(pathname);
  const showLayoutFooter = !hideLayoutfooter.includes(pathname);
  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayoutFooter && <Footer />}
    </>
  );
};

export default MainLayout;
