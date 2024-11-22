interface NavLinkProps {
  redirect: string;
  bgColor: string;
  text: string;
  textColor: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  redirect,
  bgColor,
  text,
  textColor,
}) => {
  return (
    <>
      <a
        href={redirect}
        className={`${bgColor} ${textColor} px-4 py-2 hover:bg-opacity-80 rounded-full`}
        aria-label={text}
      >
        {text}
      </a>
    </>
  );
};

export default NavLink;
