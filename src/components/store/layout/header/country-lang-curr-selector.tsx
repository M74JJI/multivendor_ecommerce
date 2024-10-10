"use client";

// React, Next.js
import { useState } from "react";

// Icons
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ChevronDown } from "lucide-react";

// Types
import { Country, SelectMenuOption } from "@/lib/types";

// Country selector
import CountrySelector from "@/components/shared/country-selector";

// countries data
import countries from "@/data/countries.json";
import { useRouter } from "next/navigation";

export default function CountryLanguageCurrencySelector({
  userCountry,
}: {
  userCountry: Country;
}) {
  // Router hook for navigation
  const router = useRouter();

  // State to manage countries dropdown visibility
  const [show, setshow] = useState(false);

  const handleCountryClick = async (country: string) => {
    // Find the country data based on the selected country name
    const countryData = countries.find((c) => c.name === country);

    if (countryData) {
      const data: Country = {
        name: countryData.name,
        code: countryData.code,
        city: "",
        region: "",
      };
      try {
        // Send a POST request to your API endpoint to set the cookie
        const response = await fetch("/api/setUserCountryInCookies", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ userCountry: data }),
        });
        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error in handleCountryClick:", error);
      }
    }
  };
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div>
        <div className="flex items-center h-11 py-0 px-2 cursor-pointer">
          <span className="mr-0.5  h-[33px] grid place-items-center">
            <span className={`fi fi-${userCountry.code.toLowerCase()}`} />
          </span>
          <div className="ml-1">
            <span className="block text-xs text-white leading-3 mt-2">
              {userCountry.name}/EN/
            </span>
            <b className="text-xs font-bold text-white ">
              USD
              <span className="text-white scale-[60%] align-middle inline-block">
                <ChevronDown />
              </span>
            </b>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        <div className="relative mt-12 -ml-32 w-[300px]  bg-white rounded-[24px] text-main-primary pt-2 px-6 pb-6 z-50 shadow-lg">
          {/* Triangle */}
          <div className="w-0 h-0 absolute -top-1.5 right-24 border-l-[10px] border-l-transparent border-b-[10px] border-white border-r-[10px] border-r-transparent" />
          <div className="mt-4 leading-6 text-[20px] font-bold">Ship to</div>
          <div className="mt-2">
            <div className="relative text-main-primary bg-white rounded-lg">
              <CountrySelector
                id={"countries"}
                open={show}
                onToggle={() => setshow(!show)}
                onChange={(val) => handleCountryClick(val)}
                selectedValue={
                  (countries.find(
                    (option) => option.name === userCountry?.name
                  ) as SelectMenuOption) || countries[0]
                }
              />
              <div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Language
                </div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-black/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">English</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-main-primary scale-75" />
                  </span>
                </div>
              </div>
              <div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Currency
                </div>
                <div className="relative mt-2 h-10 py-0 px-3 border-[1px] border-black/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">USD (US Dollar)</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-main-primary scale-75" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
