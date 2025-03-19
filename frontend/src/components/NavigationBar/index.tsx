import NavLink from "../NavLink";

const NavigationBar: React.FC = () => {
  return (
    <>
      <nav className="sticky top-0 flex flex-row items-center justify-between border-b-1 border-gray-400 px-8 py-4 shadow-sm backdrop-blur">
        <a href="/" className="text-2xl font-bold">
          LegalEase
        </a>
        <div className="flex flex-row gap-6">
          <NavLink
            redirect="/login"
            bgColor="border border-black"
            textColor="text-black"
            text="Login"
          />
          <NavLink
            redirect="/register"
            bgColor="bg-black"
            textColor="text-white"
            text="Register"
          />
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
