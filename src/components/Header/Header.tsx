import AndurilLogo from "../../assets/anduril.png";

export const Header = () => {
  return (
    <header className="app-header">
      <img
        className="app-header__logo"
        src={AndurilLogo}
        alt="Anduril Logo"
        width="36"
        height="36"
      />
      <p className="app-header__title">Pixel Interview</p>
      <span className="app-header__tag">Interview starter</span>
    </header>
  );
};
