import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-20 right-5 z-50">
      <div className="flex flex-col gap-2">
        <a href="/" target="_blank" className="inline-block">
          <button>
            <FaWhatsapp
              size={41}
              className="text-white bg-green-500 p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
            />
          </button>
        </a>
        <a href="/" target="_blank" className="inline-block">
          <button>
            <RiMessengerLine
              size={41}
              className="text-white bg-blue-500 p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
            />
          </button>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
