// src/pages/Login.jsx
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="z-10">
        <SignIn 
          path="/login"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            layout: {
               logoPlacement: "none",
               socialButtonsPlacement: "bottom",
            },
            elements: {
              card: "bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl",
              headerTitle: "text-gray-800 text-2xl font-bold font-sans",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg border-0",
              formFieldInput: "bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              formFieldLabel: "text-gray-700 font-medium",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold"
            }
          }}
        />
      </div>
    </div>
  );
}
