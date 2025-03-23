import ResetPasswordCard from "@/components/reset-password";

interface PageProps {
  params: Promise<{ email: string }>;
}

const VerifyOTP = async ({ params }: PageProps) => {
  const emailAddress = await params;

  return (
    <>
      <ResetPasswordCard email={emailAddress.email} />
    </>
  );
};

export default VerifyOTP;
