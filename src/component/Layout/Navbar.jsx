import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { userAtom } from "@/store/atoms";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  const [user, setUser] = useAtom(userAtom); // get current user

  // Determine navbar background
  const isTransparent = pathname === "/" || pathname === "/Search";
  const navbarClasses = `w-full z-50 relative ${isTransparent ? "bg-transparent" : "bg-[#F6FFFF] shadow-md"
    }`;

  // Logout handler
  const handleLogout = () => {
    setUser(null); // clear user state (Jotai)
    localStorage.clear(); // remove everything from localStorage
    router.push("/Login"); // redirect to login page
  };

  return (
    <>
      {/* NAVBAR */}
      <header className={navbarClasses}>
        <nav className="px-4 py-4 flex items-center justify-between md:justify-around">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bold text-xl font-serif ${isTransparent ? "text-white" : "text-black"
              }`}
          >
            TourANDTravel
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            <li>
              <Link
                href="/destinations"
                className={isTransparent ? "text-white" : "text-black"}
              >
                Destination
              </Link>
            </li>
            <li>
              <Link
                href="/tours"
                className={isTransparent ? "text-white" : "text-black"}
              >
                Tour Types
              </Link>
            </li>
            <li>
              <Link
                href="/my-bookings"
                className={isTransparent ? "text-white" : "text-black"}
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={isTransparent ? "text-white" : "text-black"}
              >
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right Icons / Login or Logout */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded ${isTransparent
                  ? "bg-[#ffda32] text-black"
                  : "bg-[#ffda32] text-black"
                  }`}
              >
                Logout
              </button>
            ) : (
              <Link href="/Login">
                <FaUser
                  className={`cursor-pointer ${isTransparent ? "text-white" : "text-black"
                    }`}
                />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`md:hidden text-2xl cursor-pointer ${isTransparent ? "text-white" : "text-black"
                }`}
            >
              <FaBars />
            </button>
          </div>
        </nav>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-[9998]"
        />
      )}

      {/* SIDE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-white text-black z-[9999]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Menu */}
        <ul className="mt-20 flex flex-col gap-4 px-6 text-lg">
          <li onClick={() => setOpen(false)}>
            <Link href="/destinations">Destination</Link>
          </li>
          <li onClick={() => setOpen(false)}>
            <Link href="/my-bookings">Bookings</Link>
          </li>

          <li onClick={() => setOpen(false)}>
            <Link href="/contact">Contact Us</Link>
          </li>
          {/* Mobile Logout Button */}
          {user && (
            <li onClick={handleLogout}>
              <button className="w-full text-left text-red-500 font-medium">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
