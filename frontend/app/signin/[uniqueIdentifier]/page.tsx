import VerifyCard from "@/components/verify-card";

interface PageProps {
  params: Promise<{ uniqueIdentifier: string }>;
}

const VerifyOTP = async ({ params }: PageProps) => {
  const uniqueId = await params;
  return (
    <>
      <VerifyCard uniqueId={uniqueId.uniqueIdentifier} />
    </>
  );
};

export default VerifyOTP;
