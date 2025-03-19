import { cn } from "../../lib/utils";

import { motion } from "framer-motion";

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
  return (
    <>
      <motion.a
        whileHover={{
          className: "bg-opacity-80",
        }}
        href={redirect}
        className={cn(
          bgColor,
          textColor,
          isLink && "self-center rounded-full px-4 py-2 text-sm",
        )}
        aria-label={text}
      >
        {text}
      </motion.a>
    </>
  );
};

export default NavLink;
