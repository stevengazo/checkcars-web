import React, { useEffect, useState } from "react";
import SendForgotPassword from "../Components/SendForgotpassword";
import ResetPassword from "../Components/ResetPassword";

const ForgotPassword = () => {
  const [emailSendIt, setEmailSendIt] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(emailSendIt);
  }, [emailSendIt]);

  return (
    <div className="w-screen h-screen flex justify-center  items-center">
      {
        !emailSendIt
        && <SendForgotPassword
          OnSendIt={setEmailSendIt}
          selectedEmail={setEmail}
        />
      }
      {emailSendIt && (
        <>
          <ResetPassword email={email} />
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
