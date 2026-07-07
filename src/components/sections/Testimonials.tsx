

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  review: string;
  rating: number;
  image?: string;
  created_at?: string;
}

/**
 * Public-facing testimonials/reviews section.
 * Drop this into your About Us page, e.g.:
 *
 *   import Testimonials from "@/components/sections/Testimonials";
 *   ...
 *   <AboutUs />
 *   <Testimonials />
 *
 * Only reads rows where is_published = true (enforced both by the
 * Supabase RLS policy and the query below, as a defense-in-depth check).
 */
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  // Don't render the section at all if there's nothing to show —
  // avoids an empty-looking block on the page.
  if (!loading && testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-sippy-beige">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">
            What Our <span className="text-sippy-gold">Clients Say</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real experiences from clients who found their property with Sippy Housing.
          </p>
          <div className="gold-divider"></div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-sippy-charcoal/40 text-sm">Loading reviews…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col"
              >
                {/* Stars */}
                <div className="text-sippy-gold text-lg mb-4">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>

                {/* Review */}
                <p className="text-sippy-charcoal/80 leading-relaxed italic mb-6 flex-1">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 rounded-full bg-sippy-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-sippy-gold/20">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-sippy-gold font-semibold text-sm">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sippy-charcoal text-sm font-playfair">
                      {t.name}
                    </p>
                    {t.designation && (
                      <p className="text-xs text-sippy-charcoal/50">{t.designation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;