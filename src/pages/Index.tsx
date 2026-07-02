import { useEffect, useState } from "react";
import { propertyService } from "@/services/propertyService";
import { sectionService, SectionOrder } from "@/services/sectionService";
import { Property } from "@/lib/supabase";
import { handleHashNavigation } from "@/lib/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/common/FloatingContact";
import Hero from "@/components/sections/Hero";
import JointVenture from "@/components/sections/JointVenture";
import LuxuryHomes from "@/components/sections/LuxuryHomes";
import NewProjects from "@/components/sections/NewProjects";
import Apartments from "@/components/sections/Apartments";
import ResaleRent from "@/components/sections/ResaleRent";
import IndependentBuildings from "@/components/sections/IndependentBuildings";
import Commercial from "@/components/sections/Commercial";
import PlotsLands from "@/components/sections/PlotsLands";
import RedevelopmentJV from "@/components/sections/RedevelopmentJV";
import Hotels from "@/components/sections/Hotels";
import InvestorSection from "@/components/sections/InvestorSection";
import International from "@/components/sections/International";
import AboutUs from "@/components/sections/AboutUs";
import Contact from "@/components/sections/Contact";

// map section_key -> component
const SECTION_COMPONENTS: Record<string, React.FC<{ allProperties: Property[] }>> = {
  luxury_homes: LuxuryHomes,
  new_projects: NewProjects,
  apartments: Apartments,
  resale_rent: ResaleRent,
  independent_buildings: IndependentBuildings,
  commercial: Commercial,
  plots_lands: PlotsLands,
  redevelopment_jv: RedevelopmentJV,
  hotels: Hotels,
  international: International,
};

const Index = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [sections, setSections] = useState<SectionOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [properties, sectionOrder] = await Promise.all([
        propertyService.getAllProperties(),
        sectionService.getSectionOrder(),
      ]);
      setAllProperties(properties);
      setSections(sectionOrder);
      setLoaded(true);
    };
    load();
    handleHashNavigation();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <Hero />
        <JointVenture />

        {sections.map((section) => {
          const Component = SECTION_COMPONENTS[section.section_key];
          if (!Component) return null;
          return <Component key={section.section_key} allProperties={allProperties} />;
        })}

        <InvestorSection />
        <AboutUs />
        <Contact />
      </main>
      <FloatingContact />
      <Footer />
    </div>
  );
};

export default Index;









// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import FloatingContact from "@/components/common/FloatingContact";
// import Hero from "@/components/sections/Hero";
// import JointVenture from "@/components/sections/JointVenture";
// import LuxuryHomes from "@/components/sections/LuxuryHomes";
// import Apartments from "@/components/sections/Apartments";
// import InvestorSection from "@/components/sections/InvestorSection";
// import ResaleRent from "@/components/sections/ResaleRent";
// // import InvestDubai from "@/components/sections/InvestDubai";
// import Contact from "@/components/sections/Contact";
// import AboutUs from "@/components/sections/AboutUs";
// import ComingSoon from "@/components/sections/ComingSoon";
// import International from "@/components/sections/International";
// import IndependentBuildings from "@/components/sections/IndependentBuildings";
// import Commercial from "@/components/sections/Commercial";
// import PlotsLands from "@/components/sections/PlotsLands";
// import RedevelopmentJV from "@/components/sections/RedevelopmentJV";
// import Hotels from "@/components/sections/Hotels";
// import NewProjects from "@/components/sections/NewProjects";

// import { useEffect, useState } from "react";
// import { propertyService } from "@/services/propertyService";
// import { Property } from "@/lib/supabase";
// import { handleHashNavigation } from "@/lib/navigation";

// const Index = () => {
//   const [allProperties, setAllProperties] = useState<Property[]>([]);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       const data = await propertyService.getAllProperties();
//       setAllProperties(data);
//       setLoaded(true);
//     };
//     load();
    
//     // Handle hash navigation on page load
//     handleHashNavigation();
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <Navbar />
//       <main className="pt-20 lg:pt-24">
//         <Hero />
//         <JointVenture />
//         <LuxuryHomes allProperties={allProperties} />
//          <NewProjects allProperties={allProperties} />
//         <Apartments allProperties={allProperties} />
//         <ResaleRent allProperties={allProperties} />
//         <IndependentBuildings allProperties={allProperties} />
//         <Commercial allProperties={allProperties} />
//         <PlotsLands allProperties={allProperties} />
//         <RedevelopmentJV allProperties={allProperties} />
//         <Hotels allProperties={allProperties} />
//         <InvestorSection />
//         <International allProperties={allProperties} />
//          {/* <InvestDubai allProperties={allProperties} /> */}
//         <AboutUs />

//         {/* <InvestDubai allProperties={allProperties} /> */}
//         {/* <ComingSoon /> */}
//         <Contact />
//       </main>
//       <FloatingContact />
//       <Footer />
//     </div>
//   );
// };

// export default Index;





// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import FloatingContact from "@/components/common/FloatingContact";
// import Hero from "@/components/sections/Hero";
// import JointVenture from "@/components/sections/JointVenture";
// import LuxuryHomes from "@/components/sections/LuxuryHomes";
// import Apartments from "@/components/sections/Apartments";
// import InvestorSection from "@/components/sections/InvestorSection";
// import ResaleRent from "@/components/sections/ResaleRent";
// import InvestDubai from "@/components/sections/InvestDubai";
// import Contact from "@/components/sections/Contact";
// import AboutUs from "@/components/sections/AboutUs";
// import International from "@/components/sections/International";
// import IndependentBuildings from "@/components/sections/IndependentBuildings";
// import Commercial from "@/components/sections/Commercial";
// import PlotsLands from "@/components/sections/PlotsLands";
// import RedevelopmentJV from "@/components/sections/RedevelopmentJV";
// import Hotels from "@/components/sections/Hotels";
// import LeadCapturePopup from "@/components/common/LeadCapturePopup";
// import { useLeadCapture } from "@/hooks/useLeadCapture";
// import { useEffect, useState } from "react";
// import { propertyService } from "@/services/propertyService";
// import { Property } from "@/lib/supabase";
// import { handleHashNavigation } from "@/lib/navigation";

// const Index = () => {
//   const [allProperties, setAllProperties] = useState<Property[]>([]);
//   const [loaded, setLoaded] = useState(false);

//   const { showPopup, interestLabel, triggerPopup, handleSuccess, handleClose } = useLeadCapture();

//   useEffect(() => {
//     const load = async () => {
//       const data = await propertyService.getAllProperties();
//       setAllProperties(data);
//       setLoaded(true);
//     };
//     load();
//     handleHashNavigation();
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <Navbar />

//       <main className="pt-20 lg:pt-24">
//         <Hero />
//         <JointVenture />
//         <LuxuryHomes          allProperties={allProperties} triggerPopup={triggerPopup} />
//         <Apartments           allProperties={allProperties} triggerPopup={triggerPopup} />
//         <ResaleRent           allProperties={allProperties} triggerPopup={triggerPopup} />
//         <IndependentBuildings allProperties={allProperties} triggerPopup={triggerPopup} />
//         <Commercial           allProperties={allProperties} triggerPopup={triggerPopup} />
//         <PlotsLands           allProperties={allProperties} triggerPopup={triggerPopup} />
//         <RedevelopmentJV      allProperties={allProperties} triggerPopup={triggerPopup} />
//         <Hotels               allProperties={allProperties} triggerPopup={triggerPopup} />
//         <InvestorSection />
//         <International        allProperties={allProperties} triggerPopup={triggerPopup} />
//         <InvestDubai          allProperties={allProperties} triggerPopup={triggerPopup} />
//         <AboutUs />
//         <Contact />
//       </main>

//       <FloatingContact />
//       <Footer />

//       {/* Single popup instance for the whole page */}
//       {showPopup && (
//         <LeadCapturePopup
//           interest={interestLabel}
//           onSuccess={handleSuccess}
//           onClose={handleClose}
//         />
//       )}
//     </div>
//   );
// };

// export default Index;