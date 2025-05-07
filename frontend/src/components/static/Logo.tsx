import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Logo = ({to="/"} : {to:string}) => {
  return (
    <>
      <Link to={to}>
        {logo ? (
          <img width="144" height="35" src={logo} alt="airbooking-logo" />
        ) : (
          "AirBooking"
        )}
      </Link>
    </>
  );
};

export default Logo;
