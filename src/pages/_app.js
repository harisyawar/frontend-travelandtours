// src/pages/_app.js
import "../styles/globals.css";
import { Oswald } from "next/font/google";
import MainLayout from "@/component/Layout/LayoutMain";
import AuthGuard from "@/component/AuthGuard/AuthGuard";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Ye routes jo protect karne hain
const protectedRoutes = ["/my-bookings", "/profile", "/bookingForm"];

function MyApp({ Component, pageProps, router }) {
  return (
    <MainLayout>
      <AuthGuard protectedRoutes={protectedRoutes}>
        <Component {...pageProps} />
      </AuthGuard>
    </MainLayout>
  );
}

export default MyApp;
