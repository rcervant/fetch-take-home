import SignInForm from "@/components/SignInForm";

const SignInPage = async () => {
  return (
    <>
      <div className="z-50 flex flex-1 grow items-center justify-items-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 h-full w-full p-2 md:h-auto md:w-4/6 lg:h-auto lg:w-3/6 xl:w-2/5">
          <SignInForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;