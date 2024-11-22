import NavLink from "../NavLink";

const NavigationBar: React.FC = () => {
  return (
    <>
      <nav className="flex flex-row items-center justify-between border-b-2 px-8 py-4">
        <h1 className="text-base font-bold sm:text-2xl">Logo/Home [TODO]</h1>
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
