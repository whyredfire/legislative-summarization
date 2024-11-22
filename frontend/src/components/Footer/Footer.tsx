import NavLink from "../NavLink";

const Footer = () => {
  return (
    <>
      <footer className="w-full py-8 text-center">
        Made with ❤️ by{" "}
        <NavLink
          redirect="#!"
          text="Karan Parashar"
          bgColor="bg-transparent"
          textColor="text-black"
          isLink={false}
        />
      </footer>
    </>
  );
};

export default Footer;
