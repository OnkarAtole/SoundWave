import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-title">
        {user?.name ? `Good to see you, ${user.name.split(" ")[0]} 👋` : "SoundWave"}
      </div>
      <div className="navbar-right">
        {user?.name && <span className="navbar-user">@{user.name}</span>}
        <button className="btn-logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;