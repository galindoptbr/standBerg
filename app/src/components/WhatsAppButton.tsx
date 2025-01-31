import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-20 right-5 z-50">
      <div className="flex flex-col gap-2">
        <a href="/" target="_blank" className="inline-block">
          <button>
            <IoLogoWhatsapp
              size={48}
              className="text-green-500 hover:scale-110 transition-transform cursor-pointer"
            />
          </button>
        </a>
        <a href="/" target="_blank" className="inline-block">
          <button>
            <FaFacebookMessenger
              size={42}
              className="text-blue-500 hover:scale-110 transition-transform cursor-pointer"
            />
          </button>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
