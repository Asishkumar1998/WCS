// /utils/getSidebarContent.ts

import { SidebarContent } from "./us-auth-sidebar.content";
import { sidebarRules } from "./us-auth-sidebar.rules";

export function getSidebarContent(
  country: any,
  document: any
): SidebarContent | null {
  if (!country) return null;

  // 1️⃣ countryType + docCategory
  if (country.countryTypeId && document?.docCategoryId) {
    const key = `${country.countryTypeId}_${document.docCategoryId}`;
    if (sidebarRules.byCountryTypeAndDoc[key]) {
      return sidebarRules.byCountryTypeAndDoc[key];
    }
  }

  // 2️⃣ countryId override
  if (country.countryId) {
    const countryRule = sidebarRules.byCountryId[country.countryId];
    if (countryRule) return countryRule;
  }

  // 3️⃣ countryType fallback
  if (country.countryTypeId) {
    const typeRule = sidebarRules.byCountryType[country.countryTypeId];
    if (typeRule) return typeRule;
  }

  return null;
}
