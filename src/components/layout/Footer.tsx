
 import { scrollToSection } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, TwitterIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QuickLink {
  label: string;
  url: string;
}

interface Settings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  twitter_url: string;
  footer_copyright: string;
  logo_url: string;
  quick_links: QuickLink[];
}

const DEFAULTS: Settings = {
  company_name: "Sippy Housing",
  company_email: "info@sippyhousing.com",
  company_phone: "",
  company_address: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
  twitter_url: "",
  footer_copyright: "",
  logo_url: "",
  quick_links: [],
};

/**
 * Footer driven by the website_settings table, so admins can update
 * quick links, contact info, and social links from /admin/settings
 * without touching code.
 *
 * If you already have a Footer.tsx, you can either replace it with
 * this one, or copy the `fetchSettings` effect + the quick-links /
 * contact blocks into your existing layout.
 */
const Footer = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setSettings({
          ...DEFAULTS,
          ...data,
          quick_links: Array.isArray(data.quick_links) ? data.quick_links : [],
        });
      }
    };
    fetchSettings();
  }, []);

  const year = new Date().getFullYear();
  const copyright =
    settings.footer_copyright?.trim() || `© ${year} ${settings.company_name}. All rights reserved.`;

  const socials = [
    { url: settings.facebook_url, Icon: Facebook, label: "Facebook" },
    { url: settings.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: settings.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.youtube_url, Icon: Youtube, label: "YouTube" },
    { url: settings.twitter_url, Icon: TwitterIcon, label: "Twitter" },
  ].filter((s) => s.url?.trim());

  return (
    <footer className="bg-sippy-charcoal text-white pt-2 pb-2 ">
      <div className="section-container px-4 py-4 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            {/* {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} className="h-10 mb-4 text-2xl" />
            ) : (
              <h3 className="text-xl font-bold font-playfair mb-4 text-2xl">
                {settings.company_name}
              </h3>
            )} */}
            <h3 className="text-2xl font-playfair font-bold mb-6">
              Sippy <span className="text-sippy-gold">Housing</span>
            </h3>
            <p className="text-white/80 text-base leading-relaxed">
              Elevating real estate experiences with distinguished properties and prestigious investment opportunities across Mumbai and beyond.
            </p>

            {socials.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-sippy-gold/80 flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-4 w-4 texthite-w" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links — admin-editable via /admin/settings */}
          <div>
            <h4 className="font-semibold mb-4 font-playfair text-xl">Quick Links</h4>
             <div>
            
            <ul className="space-y-3">
             <li><a href="#joint-venture" onClick={(e) => { e.preventDefault(); scrollToSection("#joint-venture"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Joint Venture</a></li>
             <li><a href="#luxury-homes" onClick={(e) => { e.preventDefault(); scrollToSection("#luxury-homes"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Luxury Homes</a></li>
               <li><a href="#apartments" onClick={(e) => { e.preventDefault(); scrollToSection("#apartments"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Apartments & Flats</a></li>
              <li><a href="#investor-section" onClick={(e) => { e.preventDefault(); scrollToSection("#investor-section"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Investor Section</a></li>
               <li><a href="#resale-rent" onClick={(e) => { e.preventDefault(); scrollToSection("#resale-rent"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Resale & Rent</a></li>
              {/* <li><a href="#invest-dubai" onClick={(e) => { e.preventDefault(); scrollToSection("#invest-dubai"); }} className="text-gray-300 hover:text-sippy-gold transition-colors cursor-pointer">Invest in Dubai</a></li> */}
             {/* <li><Link to="/about" className="text-gray-300 hover:text-sippy-gold transition-colors">About Us</Link></li> */}
            </ul>
           </div>

            {settings.quick_links.length > 0 ? (
              <ul className="space-y-3 text-base mt-4">
                {settings.quick_links.map((link, i) => (
                  <li key={i}>
                    {link.url.startsWith("http") ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-sippy-gold transition-colors "
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="text-white/70 pt-4 hover:text-sippy-gold transition-colors  "
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/40 text-base ">No links added yet.</p>
            )}
          </div>

          {/* Contact — admin-editable via /admin/settings */}
          <div>
            <h4 className="font-semibold mb-4 font-playfair  text-xl">Contact Us</h4>
            <ul className="space-y-3 text-base text-white/70">
              {settings.company_phone && (
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-sippy-gold mt-0.5 flex-shrink-0" />
                  <a href={`tel:+91${settings.company_phone}`} className="hover:text-sippy-gold transition-colors">
                    +91 {settings.company_phone}
                  </a>
                </li>
              )}
              

              {settings.company_email && (
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-sippy-gold mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${settings.company_email}`} className="hover:text-sippy-gold transition-colors">
                    {settings.company_email}
                  </a>
                </li>
              )}
              {settings.company_address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-sippy-gold mt-0.5 flex-shrink-0" />
                  <span>{settings.company_address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / extra slot — kept simple, optional to use */}
          <div>
            <h4 className="font-semibold mb-4 font-playfair  text-xl">Office Hours</h4>
            <p className="text-white/70 text-lg">Monday – Saturday: 10am – 7pm</p>
            <p className="text-white/70 text-base mt-1">Sunday: By appointment only</p>
          </div>
        </div>
        {/* Trust Badges */}
        <div className="mt-16 mb-8 border-t border-gray-700 pt-8">
          <h4 className="text-lg font-bold mb-6 text-center font-playfair">Trusted By</h4>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white/10 rounded-lg px-6 py-3 flex items-center">
              <span className="text-white font-medium">CREDAI</span>
            </div>
            <div className="bg-white/10 rounded-lg px-6 py-3 flex items-center">
              <span className="text-white font-medium">RERA Certified</span>
            </div>
            <div className="bg-white/10 rounded-lg px-6 py-3 flex items-center">
              <span className="text-white font-medium">ISO 9001:2015</span>
            </div>
            <div className="bg-white/10 rounded-lg px-6 py-3 flex items-center">
              <span className="text-white font-medium">IGBC Member</span>
            </div>
          </div>
        </div>
        <div className="mt-2 border-t border-gray-700 pt-2  text-center">
          {/* <p className="text-gray-400">© {new Date().getFullYear()} Sippy Housing. All rights reserved.</p> */}

          <p className="text-gray-400">
  © {new Date().getFullYear()} Sippy Housing. All rights reserved. |
  Developed by{" "}
  <span className="font-medium">
    Inforag Technology
  </span>
</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
