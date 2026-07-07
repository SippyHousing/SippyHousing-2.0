import React from 'react'

const Watermark = ({ link, loading = "lazy" }: { link: string; loading?: "lazy" | "eager" }) => {
  return (
    <div className="w-full h-full relative inset-0">
      <img src={link} alt="Property" className="w-full h-full object-cover" loading={loading} />
      <img src="/watermark.png" alt="watermark" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none z-50" />
    </div>
  );
};

export default Watermark
