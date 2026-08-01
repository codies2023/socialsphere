import { Menu, Search, Home, FileText, Trophy, LogOut, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({
  user,
  logout,
  searchTerm,
  setSearchTerm,
  setTab,
  tab,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const selectTab = (nextTab) => {
    setTab(nextTab);
    setMenuOpen(false);
  };

  const navItems = [
    { label: "All posts", value: "all", icon: Home },
    { label: "My posts", value: "my", icon: FileText },
    { label: "Leaderboard", value: "leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sky-300 bg-sky-200/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 max-w-6xl">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 text-left sm:gap-3"
            onClick={() => selectTab("all")}
            aria-label="Go to all posts"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              S
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent sm:text-2xl">
              SocialSphere
            </h1>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => selectTab(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === value
                    ? "bg-sky-500 text-white"
                    : "text-slate-700 hover:bg-sky-100 hover:text-sky-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="order-last w-full md:order-none md:w-auto md:flex-1">
          <div className="hidden md:flex items-center justify-center rounded-full bg-white/90 px-4 py-2 shadow-sm max-w-xl mx-auto min-w-0">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none ml-3 w-full min-w-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=38bdf8&color=fff`}
              alt={`${user.name}'s avatar`}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <span className="hidden lg:block truncate font-semibold text-slate-800">
              {user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-white transition hover:bg-sky-700"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          <button
            type="button"
            className="ml-2 rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-sky-300 bg-sky-100 px-4 py-3 md:hidden">
          <div className="mx-auto max-w-5xl space-y-3">
            <label className="flex items-center rounded-full bg-white px-3 py-2 shadow-sm">
              <Search size={18} className="shrink-0 text-slate-500" />
              <input
                type="search"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="ml-2 min-w-0 flex-1 bg-transparent outline-none text-slate-700"
              />
            </label>
            <nav className="grid grid-cols-3 gap-2" aria-label="Dashboard navigation">
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectTab(value)}
                  className={`flex flex-col items-center gap-1 rounded-full px-2 py-3 text-xs font-semibold transition ${
                    tab === value ? "bg-sky-500 text-white" : "text-slate-700 hover:bg-sky-200"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=38bdf8&color=fff`} alt="" className="h-10 w-10 rounded-full" />
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>
              <button type="button" onClick={logout} className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
