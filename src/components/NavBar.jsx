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
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto grid min-h-16 max-w-5xl grid-cols-3 items-center gap-3 px-4 sm:px-6 w-full">
        <div className="flex items-center">
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
        </div>

        <div className="hidden md:flex items-center justify-center rounded-full bg-gray-100 px-4 py-2 max-w-md mx-auto">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => selectTab(value)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === value
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=ec4899&color=fff`}
              alt={`${user.name}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden max-w-24 truncate font-semibold lg:block">
              {user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-3 py-2 text-white transition hover:bg-pink-600"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          <button
            type="button"
            className="ml-2 rounded-lg p-2 text-pink-700 hover:bg-pink-50 md:hidden"
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
        <div id="mobile-navigation" className="border-t border-pink-100 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto max-w-5xl space-y-3">
            <label className="flex items-center rounded-lg bg-gray-100 px-3 py-2">
              <Search size={18} className="shrink-0 text-gray-500" />
              <input
                type="search"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="ml-2 min-w-0 flex-1 bg-transparent outline-none"
              />
            </label>
            <nav className="grid grid-cols-3 gap-2" aria-label="Dashboard navigation">
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectTab(value)}
                  className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold ${
                    tab === value ? "bg-pink-100 text-pink-700" : "text-gray-600 hover:bg-pink-50"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:hidden">
              <div className="flex items-center gap-2">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=ec4899&color=fff`} alt="" className="h-8 w-8 rounded-full" />
                <span className="font-semibold text-gray-800">{user.name}</span>
              </div>
              <button type="button" onClick={logout} className="flex items-center gap-2 rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
