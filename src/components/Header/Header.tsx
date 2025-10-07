import AndurilLogo from "../../assets/anduril.png";

export const Header = () => {
    const style = {
      backgroundColor: "#2b2b2b",
      padding: "0rem",
      color: 'white',
      fontFamily: "Arial, Helvetica, sans-serif",
      display: "flex",
      flexDirection: "row",
      alignItems: 'center'
    };
    return (
      <nav style={style}>
        <img src={AndurilLogo} alt="Anduril Logo" width="40px" height="40px" />
        <p>Imaging Vendors</p>
      </nav>
    );
}