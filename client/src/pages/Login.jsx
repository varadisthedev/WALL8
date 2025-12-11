// src/pages/Login.jsx
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex bg-orange-50 min-h-screen items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="z-10">
        <SignIn 
          appearance={{
            layout: {
               logoPlacement: "none",
               socialButtonsPlacement: "bottom",
            },
            elements: {
              card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl",
              headerTitle: "text-gray-800 text-2xl font-bold font-sans",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg border-0",
              formFieldInput: "bg-white/50 border-gray-300 focus:border-orange-500",
              formFieldLabel: "text-gray-700 font-medium",
              footerActionLink: "text-orange-600 hover:text-orange-700 font-semibold"
            }
          }}
          signUpUrl="/sign-up" 
        />
      </div>
    </div>
  );
}
