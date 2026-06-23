import { useState, useEffect } from "react";
import { MapPin, IndianRupee, Building } from "lucide-react";
import { Property } from "@/lib/supabase";
import { propertyService } from "@/services/propertyService";
import { formatPriceWithCommas } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Watermark from "./Watermark";

const DISPLAY_LIMIT = 12;

interface IndependentBuildingsProps {
  allProperties?: Property[];
}

const IndependentBuildings = ({ allProperties }: IndependentBuildingsProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [imagesMap, setImagesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const source = allProperties ?? await propertyService.getAllProperties();
        // Filter for independent buildings category
        const filtered = source.filter(p => 
          p.primary_category === 'independent-buildings' || 
          (p.category_assignments && p.category_assignments.includes('independent-buildings'))
        );
        setProperties(filtered);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allProperties]);

  useEffect(() => {
    if (properties.length === 0) return;
    const fetchImages = async () => {
      const map: Record<string, string> = {};
      await Promise.all(
        properties.map(async (p) => {
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
  }, [properties.length]);

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const displayed = showAll ? properties : properties.slice(0, DISPLAY_LIMIT);
  const hasMore = properties.length > DISPLAY_LIMIT;

  return (
    <section id="independent-buildings" className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Independent <span className="text-sippy-gold">Buildings</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Discover standalone commercial and residential buildings with exceptional investment potential.
          </p>
          <div className="gold-divider"></div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : properties.length > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((property) => (
              <div 
                key={property.id} 
                className="property-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                onClick={() => handleViewDetails(property)}
              >
                <div className="h-48 w-full overflow-hidden bg-gray-100">
                  <Watermark link={imagesMap[property.id] || "/placeholder.svg"} />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold mb-1 line-clamp-1">{property.header || property.building}</h3>
                  <div className="flex items-center mb-3 text-sm">
                    <MapPin className="h-4 w-4 text-sippy-gold mr-1" />
                    <span className="text-sippy-charcoal/80">{property.location || property.sub_location || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-sippy-gold mr-1" />
                      <span className="font-semibold">
                      {(formatPriceWithCommas(property.price || property.price_range) || property.price || property.price_range)
                        ? ` ${formatPriceWithCommas(property.price || property.price_range) || property.price || property.price_range}`
                        : "Price on request"}
                    </span>
                    </div>
                    <div className="text-sm bg-sippy-beige px-2 py-1 rounded">
                      {property.usage_type_category || property.usage_type || 'Property'}
                    </div>
                  </div>
                  
                  {property.description && (
                    <p className="text-sm text-sippy-charcoal/70 mb-4 line-clamp-2">{property.description}</p>
                  )}
                  
                  <button 
                    className="btn-outline mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(property);
                    }}
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
                <Button className="btn-primary" onClick={() => setShowAll(true)}>Browse all independent buildings</Button>
              ) : (
                <Button variant="outline" className="border-sippy-gold text-sippy-charcoal hover:bg-sippy-beige" onClick={() => setShowAll(false)}>Show less</Button>
              )}
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-sippy-charcoal/60">No independent buildings available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default IndependentBuildings;
