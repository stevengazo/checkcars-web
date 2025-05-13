import React, { useEffect, useState } from "react";
import SendForgotPassword from "../Components/SendForgotpassword";
import ResetPassword from "../Components/ResetPassword";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [emailSendIt, setEmailSendIt] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(emailSendIt);
  }, [emailSendIt]);

  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!emailSendIt && (
          <motion.div
            key="send"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex justify-center items-center"
          >
            <SendForgotPassword
              OnSendIt={setEmailSendIt}
              selectedEmail={setEmail}
            />
          </motion.div>
        )}

        {emailSendIt && (
          <motion.div
            key="reset"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex justify-center items-center"
          >
            <ResetPassword email={email} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
