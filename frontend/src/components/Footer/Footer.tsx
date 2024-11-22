import NavLink from "../NavLink";

const Footer = () => {
  return (
    <>
      <footer className="text-center w-full py-8">
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
