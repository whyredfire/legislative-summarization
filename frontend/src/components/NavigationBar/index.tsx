const NavigationBar: React.FC = () => {
  return (
    <>
      <nav className="flex flex-row justify-between py-4 px-8 border-b-2 items-center">
        <h1>LOGO</h1>
        <ul className="flex gap-4">
          <li className="rounded-full bg-blue-500 text-white px-4 py-2">
            <a href="/login" aria-label="Login">
              Login
            </a>
          </li>
          <li className="rounded-full px-4 py-2 bg-black text-white">
            <a href="/register" aria-label="register">
              Register
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavigationBar;
