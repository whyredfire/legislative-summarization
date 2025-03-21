import LoginCard from "@/components/login-card";
import RegisterCard from "@/components/register-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  return (
    <>
      <main className="flex flex-col justify-center items-center  w-full">
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
      </main>
    </>
  );
};

export default LoginPage;
