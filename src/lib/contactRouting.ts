import { Property } from "@/lib/supabase";

export const GENERAL_CONTACT_NUMBER = "7777030607";
export const SPECIAL_CONTACT_NUMBER = "9820053962";

const SPECIAL_CATEGORY_SLUGS = new Set([
  "luxury",
  "plots-lands",
  "independent-buildings",
  "hotels",
  "international",
]);

const GENERAL_CATEGORY_SLUGS = new Set(["new-project", "resale-rental"]);

export const formatIndianPhone = (phone: string): string => `+91 ${phone}`;

export const getPhoneHref = (phone: string): string => `tel:+91${phone}`;

export const getWhatsAppHref = (phone: string, message: string): string =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const getContactNumberByType = (type?: string): string => {
  const text = (type || "").toLowerCase();

  if (
    text.includes("luxury") ||
    text.includes("plot") ||
    text.includes("independent") ||
    text.includes("hotel") ||
    text.includes("international")
  ) {
    return SPECIAL_CONTACT_NUMBER;
  }

  return GENERAL_CONTACT_NUMBER;
};

export const getContactNumberByProperty = (
  property?: Partial<Property> & { type?: string }
): string => {
  if (!property) {
    return GENERAL_CONTACT_NUMBER;
  }

  const primary = (property.primary_category || "").toLowerCase();
  const assignments = (property.category_assignments || []).map((item) =>
    item.toLowerCase()
  );
  const allCategories = [primary, ...assignments].filter(Boolean);

  if (allCategories.some((slug) => SPECIAL_CATEGORY_SLUGS.has(slug))) {
    return SPECIAL_CONTACT_NUMBER;
  }

  if (allCategories.some((slug) => GENERAL_CATEGORY_SLUGS.has(slug))) {
    return GENERAL_CONTACT_NUMBER;
  }

  const usageText = [
    property.usage_type,
    property.usage_type_category,
    property.property_type_international,
    property.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    usageText.includes("luxury") ||
    usageText.includes("plot") ||
    usageText.includes("independent") ||
    usageText.includes("hotel") ||
    usageText.includes("international")
  ) {
    return SPECIAL_CONTACT_NUMBER;
  }

  if (
    usageText.includes("new") ||
    usageText.includes("resale") ||
    usageText.includes("residential") ||
    usageText.includes("commercial")
  ) {
    return GENERAL_CONTACT_NUMBER;
  }

  return GENERAL_CONTACT_NUMBER;
};
