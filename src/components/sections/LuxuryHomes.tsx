import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Home, BadgeCheck } from "lucide-react";
import { Property } from "@/lib/supabase";
import { getPropertyPriceStr, formatPriceWithCommas } from "@/lib/utils";
import { propertyService } from "@/services/propertyService";
import { Button } from "@/components/ui/button";
import Watermark from "./Watermark";
import LeadCapturePopup from "@/components/common/LeadCapturePopup";

import { getFunnelSetting } from "@/services/funnelService";
const DISPLAY_LIMIT  = 12;
const SESSION_KEY    = "sippy_lead_captured";

interface LuxuryHomesProps {
  allProperties?: Property[];
}

const LuxuryHomes = ({ allProperties }: LuxuryHomesProps) => {
  const navigate = useNavigate();
  const [premiumProperties, setPremiumProperties] = useState<Property[]>([]);
  const [imagesMap, setImagesMap]                 = useState<Record<string, string>>({});
  const [loading, setLoading]                     = useState(true);
  const [showAll, setShowAll]                     = useState(false);

  // which property's popup is open  (null = closed)
  const [popupProperty, setPopupProperty] = useState<Property | null>(null);

  const displayed = showAll ? premiumProperties : premiumProperties.slice(0, DISPLAY_LIMIT);
  const hasMore   = premiumProperties.length > DISPLAY_LIMIT;

  /* clicking "View Details" on a card */
  // const handleViewDetails = (e: React.MouseEvent, property: Property) => {
  //   e.stopPropagation();
  //   // already registered this session → go straight to detail page
  //   if (sessionStorage.getItem(SESSION_KEY)) {
  //     navigate(`/property/${property.id}`);
  //     return;
  //   }
  //   // show the lead capture popup first
  //   setPopupProperty(property);
  // };
const handleViewDetails = async (
  e: React.MouseEvent,
  property: Property
) => {
  e.stopPropagation();

  if (sessionStorage.getItem(SESSION_KEY)) {
    navigate(`/property/${property.id}`);
    return;
  }

  const funnelEnabled = await getFunnelSetting();

  if (funnelEnabled) {
    setPopupProperty(property);
  } else {
    navigate(`/property/${property.id}`);
  }
};


  /* after user submits the form successfully */
  const handlePopupSuccess = () => {
    const prop = popupProperty;
    setPopupProperty(null);
    if (prop) navigate(`/property/${prop.id}`);
  };

  /* user dismissed the popup without submitting */
  const handlePopupClose = () => {
    setPopupProperty(null);
  };

  useEffect(() => {
    const fetchLuxuryProperties = async () => {
      try {
        setLoading(true);
        const luxuryProps = allProperties
          ? allProperties.filter(p =>
              p.primary_category === "luxury" ||
              (p.category_assignments && p.category_assignments.includes("luxury"))
            )
          : await propertyService.getPropertiesByCategory("luxury");
        setPremiumProperties(luxuryProps);
      } catch (error) {
        console.error("Error fetching luxury properties:", error);
        setPremiumProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLuxuryProperties();
  }, [allProperties]);

  useEffect(() => {
    if (premiumProperties.length === 0) return;
    const fetchImages = async () => {
      const map: Record<string, string> = {};
      await Promise.all(
        premiumProperties.map(async (p) => {
          try {
            const images = await propertyService.getPropertyImages(p.id);
            map[p.id] = images.length > 0 ? images[0].image_url : "/placeholder.svg";
          } catch {
            map[p.id] = "/placeholder.svg";
          }
        })
      );
      setImagesMap(map);
    };
    const t = setTimeout(fetchImages, 0);
    return () => clearTimeout(t);
  }, [premiumProperties.length]);
  

  return (
    <section id="luxury-homes" className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Ultra <span className="text-sippy-gold">Luxury</span> Homes
          </h2>
          <p className="section-subtitle mx-auto">
            Discover our collection of the most prestigious properties in Mumbai,
            representing the pinnacle of luxury living.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayed.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Image — NOT clickable for popup, just display */}
              <div className="h-64 w-full overflow-hidden bg-gray-100"  onClick={(e) => handleViewDetails(e, property)}>
                <Watermark link={imagesMap[property.id] || "/placeholder.svg"} />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-playfair">
                  {property.header || property.building}
                </h3>
                <div className="flex items-center mb-4">
                  <MapPin className="h-4 w-4 text-sippy-gold mr-1" />
                  <span className="text-sippy-charcoal/80">
                    {property.location || property.sub_location || "Location not specified"}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <IndianRupee className="h-5 w-5 text-sippy-gold mr-1" />
                  <span className="text-xl font-semibold">
                    {(formatPriceWithCommas(getPropertyPriceStr(property)) || getPropertyPriceStr(property))
                      ? ` ${formatPriceWithCommas(getPropertyPriceStr(property)) || getPropertyPriceStr(property)}`
                      : "Price on request"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                  {property.size && (
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-sippy-gold mr-2" />
                      <span>{property.size}</span>
                    </div>
                  )}
                  {property.flat_size && (
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-sippy-gold mr-2" />
                      <span>{property.flat_size}</span>
                    </div>
                  )}
                  {property.configuration_type && (
                    <div><span className="font-medium">{property.configuration_type}</span></div>
                  )}
                  {property.bhk && (
                    <div><span className="font-medium">{property.bhk}</span> BHK</div>
                  )}
                </div>

                {/* ── View Details triggers the lead popup ── */}
                <button
                  type="button"
                  className="btn-outline w-full flex items-center justify-center"
                  onClick={(e) => handleViewDetails(e, property)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            {!showAll ? (
              <Button className="btn-primary" onClick={() => setShowAll(true)}>
                Browse all luxury homes
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-sippy-gold text-sippy-charcoal hover:bg-sippy-beige"
                onClick={() => setShowAll(false)}
              >
                Show less
              </Button>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center border border-sippy-gold px-6 py-3 rounded-full">
            <BadgeCheck className="h-5 w-5 text-sippy-gold mr-2" />
            <span className="text-sippy-charcoal font-medium">
              All properties are RERA certified
            </span>
          </div>
        </div>
      </div>

      {/* Lead capture popup — shown only when View Details is clicked */}
      {popupProperty && (
        <LeadCapturePopup
          interest={`Luxury Homes – ${popupProperty.header || popupProperty.building || popupProperty.location || "Property"}`}
          onSuccess={handlePopupSuccess}
          onClose={handlePopupClose}
        />
      )}
    </section>
  );
};

export default LuxuryHomes;
