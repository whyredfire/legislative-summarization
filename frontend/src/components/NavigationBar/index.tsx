import NavLink from "../NavLink";

const NavigationBar: React.FC = () => {
  return (
    <>
      <nav className="flex flex-row justify-between py-4 px-8 border-b-2 items-center">
        <h1 className="text-base sm:text-2xl font-bold ">Logo/Home [TODO]</h1>
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
