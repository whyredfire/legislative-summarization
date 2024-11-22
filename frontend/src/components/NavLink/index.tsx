interface NavLinkProps {
  redirect: string;
  bgColor: string;
  text: string;
  textColor: string;
  isLink?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  redirect,
  bgColor,
  text,
  textColor,
  isLink = true,
}) => {
  const buttonPadding = "px-4 py-2 hover:bg-opacity-80 rounded-full";

  return (
    <>
      <a
        href={redirect}
        className={`${bgColor} ${textColor} ${isLink ? buttonPadding : ""}`}
        aria-label={text}
      >
        {text}
      </a>
    </>
  );
};

export default NavLink;
