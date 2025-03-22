import { MutedText, P } from "../ui/typography";

const Footer = () => {
  return (
    <>
      <footer className="border-grid border-t py-6 md:py-0">
        <div className="container-wrapper container text-center py-4">
          <P>Made with &#x2665;&#xfe0f; by Team Legislative Summarization</P>
          <MutedText>
            &copy; Copyright 2025 - {new Date().getFullYear()}. All Rights
            Reserved.
          </MutedText>
        </div>
      </footer>
    </>
  );
};

export default Footer;
