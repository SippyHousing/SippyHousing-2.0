
import React, { useState } from "react";

const Watermark = ({
  link,
  loading = "lazy",
}: {
  link: string;
  loading?: "lazy" | "eager";
}) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <>
      <div
        className="w-full h-full relative inset-0 cursor-pointer"
        onClick={() => setShowImage(true)}
      >
        <img
          src={link}
          alt="Property"
          className="w-full h-full object-cover"
          loading={loading}
        />

        <img
          src="/watermark.png"
          alt="watermark"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none z-50"
        />
      </div>

      {showImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={() => setShowImage(false)}
        >
          <img
            src={link}
            alt="Property"
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />

          <button
            className="absolute top-5 right-5 bg-white px-3 py-1 rounded"
            onClick={() => setShowImage(false)}
          >
            X
          </button>
        </div>
      )}
    </>
  );
};

export default Watermark;