import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-32 right-5 z-50">
      <a href="/" target="_blank" className="inline-block">
        <button>
          <IoLogoWhatsapp
            size={60}
            className="text-green-500 hover:scale-110 transition-transform cursor-pointer"
          />
        </button>
      </a>
    </div>
  );
};

export default WhatsAppButton;
