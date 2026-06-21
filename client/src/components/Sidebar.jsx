import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {

  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const navItems = [
    { to: "/home", icon: "🏠", label: "Home" },
    { to: "/favorites", icon: "❤️", label: "Favorites" },
    { to: "/playlists", icon: "📂", label: "Playlists" },
    { to: "/history", icon: "🕐", label: "Recently Played" },
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
  ];

  // Add Upload Song only for admin
  if (user?.role === "admin") {
    navItems.push({
      to: "/upload-song",
      icon: "⬆️",
      label: "Upload Song"
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎵</div>
        <span className="sidebar-logo-text">
          SoundWave
        </span>
      </div>

      <p className="sidebar-section-label">
        Menu
      </p>

      <ul className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={pathname === to ? "active" : ""}
            >
              <span className="nav-icon">
                {icon}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;