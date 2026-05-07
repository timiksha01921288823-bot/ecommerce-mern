import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { navigation } from "../../../config/navigationMenu";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../Redux/Auth/Action";
import { getCart } from "../../../Redux/Customers/Cart/Action";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart(jwt));
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    if (auth.user?.role !== "ADMIN" && ["/login", "/register"].includes(location.pathname)) {
      navigate(-1);
    }
  }, [auth.user, location.pathname, navigate]);

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
  };

  const handleMyOrderClick = () => {
    handleCloseUserMenu();
    navigate("/account/order");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/40" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <Link to="/" className="text-xl font-black tracking-[0.35em] text-slate-900">
                    Shop With Zosh
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-10 border-t border-slate-200 pt-6">
                  <p className="mb-3 text-xs uppercase tracking-[0.35em] text-slate-400">Collections</p>
                  <div className="space-y-3">
                    {navigation.categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/${category.id}`}
                        className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                        onClick={() => setOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-black tracking-[0.35em] text-slate-900">
            Shop With Zosh
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Home
          </Link>
          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              to={page.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {page.name}
            </Link>
          ))}
          {navigation.categories.map((category) => (
            <Link
              key={category.id}
              to={`/${category.id}`}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search styles"
              className="h-11 w-72 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <Button
            onClick={auth.user ? handleUserClick : handleLoginClick}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 999, textTransform: "none", borderColor: "#CBD5E1", color: "#334155" }}
          >
            {auth.user ? auth.user.firstName || "Account" : "Sign in"}
          </Button>

          <Button
            onClick={() => navigate("/cart")}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 999, textTransform: "none", px: 4 }}
            startIcon={<ShoppingBagIcon />}
          >
            Cart
          </Button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-900 md:hidden"
            onClick={() => setOpen(true)}
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={openUserMenu} onClose={handleCloseUserMenu}>
        <MenuItem onClick={handleMyOrderClick}>Orders</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
