import LoginCard from "@/components/login-card";
import RegisterCard from "@/components/register-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = async () => {
  return (
    <>
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginCard />
        </TabsContent>
        <TabsContent value="register">
          <RegisterCard />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default LoginPage;
