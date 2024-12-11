import React, { useState } from "react";
import { Share2, MailIcon, Share, Phone } from "lucide-react";

const ShareButtons = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Encode text for URL sharing
  const encodedText = encodeURIComponent(content);
  const shareTitle = encodeURIComponent("Partage d'un verset");

  // WhatsApp share link
  const whatsappShareLink = `https://wa.me/?text=${encodedText}`;

  // Gmail share link (opens compose with pre-filled content)
  const gmailShareLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${shareTitle}&body=${encodedText}`;

  const handleShareToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsAppShare = () => {
    window.open(whatsappShareLink, "_blank");
    setIsOpen(false);
  };

  const handleGmailShare = () => {
    window.open(gmailShareLink, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main share button */}
      <button
        className="flex justify-center items-center rounded-full border p-2"
        onClick={handleShareToggle}
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* Share options dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 flex gap-2 bg-white border rounded-lg p-2 shadow-lg">
          <button
            onClick={handleWhatsAppShare}
            className="hover:bg-green-100 p-2 rounded-full"
            title="Partager sur WhatsApp"
          >
            <Phone className="h-5 w-5   " />
          </button>

          <button
            onClick={handleGmailShare}
            className="hover:bg-red-100 p-2 rounded-full"
            title="Partager par Gmail"
          >
            <MailIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
