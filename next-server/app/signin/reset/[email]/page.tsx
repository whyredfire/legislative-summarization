import ResetPasswordCard from "@/components/reset-password";

interface PageProps {
  params: Promise<{ email: string }>;
}

const VerifyOTP = async ({ params }: PageProps) => {
  const data = await params;
  const encodedEmail = data.email;

  // we need to use decodeURIComponent here because
  // = gets converted to %3D, etc..
  const decodedBase64 = decodeURIComponent(encodedEmail);
  const decodedEmail = atob(decodedBase64);

  return (
    <>
      <ResetPasswordCard email={decodedEmail} />
    </>
  );
};

export default VerifyOTP;
