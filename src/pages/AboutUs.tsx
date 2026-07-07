
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/common/FloatingContact";
import ScrollToTop from "@/components/common/ScrollToTop";
import { handleHashNavigation } from "@/lib/navigation";
import ExhibitionCarousel from "@/components/ui/exhibition-carousel";
import TestimonialsSection from "@/components/sections/Testimonials";


/* ─── static member organisations (not managed via admin) ─── */
const memberOrganizations = [
  {
    id: 'nar-india', 
    image: '/member_of/national-association-of-realtors-india-nar-india-logo-png_seeklogo-412945.png',
    name: 'NAR India',
    description: 'National Association of Realtors India',
  },
  {
    id: 'trek',
    image: '/member_of/Trek.png',
    name: 'TREK',
    description: 'Real Estate Knowledge Platform',
  },
  {
    id: 'logo',
    image: '/member_of/logo.png',
    name: 'Industry Partner',
    description: 'Real Estate Industry Association',
  },
];


/* ─── how many items to show before "View all" ─── */
const INITIAL_PARTNERS = 15;
const INITIAL_AWARDS   = 10;

const AboutUs = () => {
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [showAllAwards,   setShowAllAwards]   = useState(false);

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [awards,      setAwards]      = useState<any[]>([]);
  const [partners,    setPartners]    = useState<any[]>([]);
const [testimonials, setTestimonials] = useState([]);
const [reviewForm, setReviewForm] = useState({
  name: "",
  rating: "",
  review: "",
});
  useEffect(() => {
    handleHashNavigation();
    fetchTeamMembers();
    fetchAwards();
    fetchPartners();
    fetchTestimonials();
  }, []);

  const fetchTeamMembers = async () => {
    const { data, error } = await supabase.from('team_members').select('*');
    if (!error && data) setTeamMembers(data);
    else console.error('team_members fetch error:', error);
  };

  const fetchAwards = async () => {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setAwards(data);
    else console.error('awards fetch error:', error);
  };

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setPartners(data);
    else console.error('partners fetch error:', error);
  };
  const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("id", { ascending: false });

  if (!error && data) {
    setTestimonials(data);
  } else {
    console.error(error);
  }
};
const handleReviewSubmit = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("testimonials")
    .insert([reviewForm]);

  if (!error) {
    alert("Thank you for your review!");
    setReviewForm({
      name: "",
      rating: "",
      review: "",
    });

    fetchTestimonials();
  }
};

  /* ── derived lists ── */
  const visiblePartners = showAllPartners ? partners : partners.slice(0, INITIAL_PARTNERS);
  const visibleAwards   = showAllAwards   ? awards   : awards.slice(0, INITIAL_AWARDS);

  return (
    <div className="min-h-screen bg-sippy-beige">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-sippy-light to-white">
        <div className="section-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-sippy-charcoal mb-6 font-playfair">
              About <span className="text-sippy-gold">Sippy Housing</span>
            </h1>
            <div className="gold-divider" />
            <p className="text-lg md:text-xl text-sippy-charcoal/80 leading-relaxed mb-6 max-w-4xl mx-auto">
              Founded in 1992 by Sanjay Sippy, Sippy Housing is a trusted name in luxury real estate advisory in Mumbai.
              We specialize in Luxury and Uber-Luxury homes, focusing on some of the city's most sought-after locations
              including South Mumbai, Worli, Bandra, Khar, Santacruz, and Juhu.
            </p>
            <p className="text-lg md:text-xl text-sippy-charcoal/80 leading-relaxed mb-6 max-w-4xl mx-auto">
              We deal in premium residences, high-end commercial spaces, prime land parcels, plots, and redevelopment
              opportunities, offering end-to-end support from property discovery to deal closure ensuring a smooth and
              transparent experience for our clients.
            </p>
            <p className="text-lg md:text-xl text-sippy-charcoal/80 leading-relaxed mb-8 max-w-4xl mx-auto">
              At Sippy Housing, we believe real estate is not just about transactions, but about building trust, value,
              and long-term satisfaction. We work to bring happiness by offering holistic, practical, and well-informed
              real estate solutions that truly work for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="pt-8 pb-8 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Our <span className="text-sippy-gold">Team</span></h2>
            <p className="text-lg md:text-xl mb-12 text-sippy-charcoal/80 max-w-3xl mx-auto">
              Meet the dedicated professionals who make Sippy Housing a trusted name in real estate
            </p>
          </div>

          {/* Founder card — always pinned at top */}
          <div className="property-card group text-center border-2 border-sippy-gold/30 hover:border-sippy-gold transition-all duration-300 mb-6">
            <div className="relative overflow-hidden">
              <img
                src="/Team/Sanjay.avif"
                alt="Sanjay Sippy"
                className="w-full h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = '/Team/placeholder.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-sippy-charcoal mb-2 font-playfair">Sanjay Sippy</h3>
              <p className="text-sippy-gold font-medium mb-3">Promoter and Founder</p>
              <p className="text-sippy-charcoal/70 text-sm leading-relaxed">
                Visionary leader with over 30 years of experience in real estate development and strategic planning.
              </p>
            </div>
          </div>

          {/* Dynamic team members from Supabase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={member.id ?? index} className="property-card group text-center border-2 border-sippy-gold/30 hover:border-sippy-gold transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/Team/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-sippy-charcoal mb-2 font-playfair">{member.name}</h3>
                  <p className="text-sippy-gold font-medium mb-3">
                    {member.designation}
                    {member.company && (
                      <span className="block text-sm text-sippy-charcoal/70 mt-1">{member.company}</span>
                    )}
                  </p>
                  <p className="text-sippy-charcoal/70 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-8 bg-sippy-light">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="section-title">Our <span className="text-sippy-gold">Partners</span></h2>
            <p className="text-lg md:text-xl mb-8 text-sippy-charcoal/80 max-w-3xl mx-auto">
              Building strong relationships with industry leaders, community organisations, and strategic partners
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6 md:gap-8">
            {visiblePartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-md border border-gray-100 hover:border-sippy-gold/40 shadow-sm hover:shadow-md transition p-3 flex items-center justify-center"
              >
                <img
                  src={partner.image}
                  alt={partner.name || partner.title || 'Partner Logo'}
                  className="w-full h-20 md:h-24 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>
            ))}
          </div>

          {/* Show "View all / View less" only when there are more than the initial count */}
          {partners.length > INITIAL_PARTNERS && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllPartners(!showAllPartners)} className="btn-outline">
                {showAllPartners ? 'View less' : `View all (${partners.length})`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-8 bg-sippy-light">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="section-title">Awards &amp; <span className="text-sippy-gold">Recognition</span></h2>
            <p className="text-lg md:text-xl mb-8 text-sippy-charcoal/80 max-w-3xl mx-auto">
              Our commitment to excellence has been recognised by industry leaders and clients
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6 md:gap-8">
            {visibleAwards.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-md border border-gray-100 hover:border-sippy-gold/40 shadow-sm hover:shadow-md transition p-3"
              >
                <div className="w-full h-40 md:h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src={award.image}
                    alt={award.title || 'Award'}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                </div>
                {/* {award.title && (
                  <p className="text-center text-xs text-sippy-charcoal/70 mt-2 font-medium line-clamp-2">
                    {award.title}
                  </p>
                )}
                {award.year && (
                  <p className="text-center text-xs text-sippy-gold font-bold mt-1">{award.year}</p>
                )} */}
              </div>
            ))}
          </div>

          {/* Show "View all / View less" only when there are more than the initial count */}
          {awards.length > INITIAL_AWARDS && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllAwards(!showAllAwards)} className="btn-outline">
                {showAllAwards ? 'View less' : `View all (${awards.length})`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Proud Members ── */}
      <section className="py-8 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Proud <span className="text-sippy-gold">Members</span></h2>
            <p className="text-lg md:text-xl mb-12 text-sippy-charcoal/80 max-w-3xl mx-auto">
              We are proud to be associated with leading industry organisations and associations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {memberOrganizations.map((member) => (
              <div key={member.id} className="group">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-gray-100 hover:border-sippy-gold/30 text-center">
                  <div className="flex items-center justify-center h-24 mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-sippy-charcoal mb-2 text-center">{member.name}</h3>
                  {member.description && (
                    <p className="text-sm text-sippy-charcoal/70 text-center">{member.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exhibition Gallery ── */}
      <section className="py-8 bg-sippy-light">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Exhibition <span className="text-sippy-gold">Gallery</span></h2>
            <p className="text-lg md:text-xl mb-12 text-sippy-charcoal/80 max-w-3xl mx-auto">
              Showcasing our presence at industry exhibitions and events
            </p>
          </div>
          <ExhibitionCarousel />
        </div>
      </section>

    {/* Team Members Section */}
  
     <section>
   {/* ✅ ADD HERE */}
      <TestimonialsSection />

     </section>

      {/* Testimonials */}
{/* <section className="py-12 bg-white">
  <div className="section-container">

    <div className="text-center mb-12">
      <h2 className="section-title">
        Client <span className="text-sippy-gold">Reviews</span>
      </h2>

      <p className="text-lg text-sippy-charcoal/80">
        What our valued clients say about us
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((item) => (
        <div
          key={item.id}
          className="bg-sippy-light rounded-lg p-6 shadow-sm border border-sippy-gold/20"
        >
          <div className="text-sippy-gold text-xl mb-3">
            {"⭐".repeat(item.rating)}
          </div>

          <p className="text-sippy-charcoal/80 italic mb-4">
            "{item.review}"
          </p>

          <h4 className="font-semibold text-sippy-charcoal">
            {item.name}
          </h4>
        </div>
      ))}
    </div>

  </div>
</section> */}
{/* Review Form */}
<section className="py-12 bg-sippy-light">
  <div className="section-container">

    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-sippy-gold/20">

      <div className="text-center mb-8">
        <h2 className="section-title">
          Share Your <span className="text-sippy-gold">Experience</span>
        </h2>
      </div>

      <form
        onSubmit={handleReviewSubmit}
        className="space-y-5"
      >

        <input
          type="text"
          placeholder="Your Name"
          value={reviewForm.name}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              name: e.target.value,
            })
          }
          className="w-full border rounded-md px-4 py-3"
          required
        />

        <select
          value={reviewForm.rating}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              rating: e.target.value,
            })
          }
          className="w-full border rounded-md px-4 py-3"
          required
        >
          <option value="">
            Select Rating
          </option>
          <option value="5">
            ⭐⭐⭐⭐⭐
          </option>
          <option value="4">
            ⭐⭐⭐⭐
          </option>
          <option value="3">
            ⭐⭐⭐
          </option>
          <option value="2">
            ⭐⭐
          </option>
          <option value="1">
            ⭐
          </option>
        </select>

        <textarea
          rows={5}
          placeholder="Write your review..."
          value={reviewForm.review}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              review: e.target.value,
            })
          }
          className="w-full border rounded-md px-4 py-3"
          required
        />

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Submit Review
        </button>

      </form>

    </div>

  </div>
</section>

      {/* ── CTA ── */}
      <section className="py-8 bg-sippy-charcoal text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Let our experienced team guide you through your real estate journey with personalised service and expert advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="btn-primary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us Today
            </a>
            <a href="/" className="btn-outline text-white border-white hover:bg-white hover:text-sippy-charcoal">
              View Properties
            </a>
          </div>
        </div>
      </section>

      <FloatingContact />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default AboutUs;
