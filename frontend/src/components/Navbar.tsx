import { useState } from "react";
import logo from "../assets/logo.jpeg";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const dashboardLink = user
    ? user.role === "trainer"
      ? "/trainer"
      : user.role === "admin"
        ? "/admin"
        : "/student"
    : "/login";

  if (loading) return null;

  return (
    <header className="sticky top-0 z-40 overflow-hidden">
      <div className="flex w-full h-[75px] md:h-[85px] bg-[#fef5e4]">
        {/* LEFT */}
        <div className="w-fit flex items-center pl-2 md:pl-10 pr-0 mr-[-1px]">
          <Link to="/" className="h-full flex items-center">
            <img
              src={logo}
              alt="LearnILM World"
              className="h-full w-auto object-fill block"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-[#5186cd] flex items-center justify-end pr-4 md:pr-10">

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/about#about"
              className="text-lg font-medium text-white hover:text-[#CBE56A] transition no-underline"
            >
              About
            </Link>
            <Link
              to="/about#careers"
              className="text-lg font-medium text-white hover:text-[#CBE56A] transition no-underline"
            >
              Careers
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={dashboardLink}
                  className="text-lg font-medium text-white hover:text-[#CBE56A] transition no-underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="px-6 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold shadow hover:bg-gray-100 hover:scale-105 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-lg font-medium text-white hover:text-[#CBE56A] transition no-underline"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full bg-white text-[#276dc9] text-base font-bold shadow hover:scale-105 transition no-underline"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* MOBILE MENU */}
          <div className="lg:hidden text-white ml-auto flex items-center">
            <Button
              variant="link"
              className="text-white text-4xl p-0 no-underline"
              onClick={() => setShowOffcanvas(true)}
            >
              ☰
            </Button>

            <Offcanvas
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column gap-4">
                  <Nav.Link
                    as={Link}
                    to="/about#about"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    About
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/about#careers"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Careers
                  </Nav.Link>

                  {user ? (
                    <>
                      <Nav.Link
                        as={Link}
                        to={dashboardLink}
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Dashboard
                      </Nav.Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                          setShowOffcanvas(false);
                        }}
                        className="w-full mt-2 px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Sign In
                      </Nav.Link>
                      <Link
                        to="/register"
                        onClick={() => setShowOffcanvas(false)}
                        className="w-full mt-2 block text-center px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold no-underline"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;