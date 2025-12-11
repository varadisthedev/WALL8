// src/pages/SignUp.jsx
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex bg-gray-900 min-h-screen items-center justify-center">
      <SignUp 
         appearance={{
          elements: {
            rootBox: "w-full ring-0",
            card: "bg-gray-800 shadow-xl border border-gray-700",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-700 text-white border-gray-600 hover:bg-gray-600",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-900 border-gray-700 text-white",
            footerActionText: "text-gray-400",
            footerActionLink: "text-blue-400 hover:text-blue-300"
          }
        }}
        signInUrl="/login" 
      />
    </div>
  );
}
