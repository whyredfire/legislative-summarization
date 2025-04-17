import VerifyCard from "@/components/verify-card";

interface PageProps {
  params: Promise<{ uniqueIdentifier: string }>;
}

const VerifyOTP = async ({ params }: PageProps) => {
  const data = await params;
  return (
    <>
      <VerifyCard uniqueId={data.uniqueIdentifier} />
    </>
  );
};

export default VerifyOTP;
