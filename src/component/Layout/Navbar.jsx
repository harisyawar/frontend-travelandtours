import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/atoms";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const [user, setUser] = useAtom(userAtom); // get current user

  // Determine navbar background
  const isTransparent = pathname === "/" || pathname === "/Search";
  const navbarClasses = `w-full z-50 relative ${
    isTransparent ? "bg-transparent" : "bg-[#F6FFFF] shadow-md"
  }`;

  // Logout handler
  const handleLogout = () => {
    setUser(null); // clear user state (Jotai)
    localStorage.clear(); // remove everything from localStorage
    window.location.href = "/Login"; // redirect to login page
  };

  return (
    <>
      {/* NAVBAR */}
      <header className={navbarClasses}>
        <nav className="px-4 py-4 flex items-center justify-between md:justify-around">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bold text-xl font-serif ${
              isTransparent ? "text-white" : "text-black"
            }`}
          >
            TourANDTravel
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            {user && (
              <>
                <li>
                  <Link
                    href="/my-bookings"
                    className={isTransparent ? "text-white" : "text-black"}
                  >
                    Bookings
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                href="/my-bookings"
                className={isTransparent ? "text-white" : "text-black"}
              >
                About us
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
                className={`px-4 py-2 rounded ${
                  isTransparent
                    ? "bg-[#ffda32] text-black"
                    : "bg-[#ffda32] text-black"
                }`}
              >
                Logout
              </button>
            ) : (
              <Link href="/Login">
                <FaUser
                  className={`cursor-pointer ${
                    isTransparent ? "text-white" : "text-black"
                  }`}
                />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`md:hidden text-2xl cursor-pointer ${
                isTransparent ? "text-white" : "text-black"
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

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xm z-[9998]"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-white text-black z-[9999]
  transform transition-transform duration-300 ease-in-out
  shadow-2xl rounded-r-2xl
  ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#10E9DD]">
          <Link href="/" onClick={() => setOpen(false)}>
            <span className="font-extrabold text-xl tracking-wide text-gray-900 font-serif">
              TourANDTravel
            </span>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-black transition"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Menu */}
        <ul className="mt-6 px-6 flex flex-col gap-5 text-[16px] font-medium">
          <li
            onClick={() => setOpen(false)}
            className="hover:text-[#10E9DD] transition"
          >
            <Link href="/contact">About Us</Link>
          </li>

          <li
            onClick={() => setOpen(false)}
            className="hover:text-[#10E9DD] transition"
          >
            <Link href="/contact">Contact Us</Link>
          </li>

          {user && (
            <li
              onClick={() => setOpen(false)}
              className="hover:text-[#10E9DD] transition"
            >
              <Link href="/my-bookings">My Bookings</Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
