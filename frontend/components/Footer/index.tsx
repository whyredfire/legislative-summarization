import { MutedText, SmallText } from "../ui/typography";

const Footer = () => {
  return (
    <>
      <footer className="border-grid border-t py-6 md:py-0">
        <div className="container-wrapper container text-center py-4">
          <SmallText className="font-md">
            Made with &#x2665;&#xfe0f; by Team Legislative Summarization
          </SmallText>
          <MutedText className="mt-2 font-sm">
            &copy; Copyright 2025 - {new Date().getFullYear()}. All Rights
            Reserved.
          </MutedText>
        </div>
      </footer>
    </>
  );
};

export default Footer;
