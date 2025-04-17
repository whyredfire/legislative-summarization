import { H1, LargeText, P } from "@/components/ui/typography";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <>
      <main className="text-center">
        <H1>404</H1>
        <LargeText>Page not found</LargeText>
        <P>
          Redirect to home page from{" "}
          <Link className="text-blue-500 hover:text-blue-600" href={"/"}>
            here
          </Link>
        </P>
      </main>
    </>
  );
};

export default NotFoundPage;
