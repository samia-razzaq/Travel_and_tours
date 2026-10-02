"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const countries = [
  { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "SE", dial: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "CH", dial: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
  { code: "KR", dial: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "TH", dial: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "TR", dial: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "EG", dial: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "ZA", dial: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "NG", dial: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "AR", dial: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "RU", dial: "+7", flag: "🇷🇺", name: "Russia" },
];

interface CountryConfig {
  digitLength: number;
  format: (digits: string) => string;
  validPrefixes?: string[];
}

const countryConfigs: Record<string, CountryConfig> = {
  PK: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
    validPrefixes: ["3"],
  },
  IN: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    },
    validPrefixes: ["6", "7", "8", "9"],
  },
  AE: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    },
    validPrefixes: ["50", "52", "55", "56", "58"],
  },
  US: {
    digitLength: 10,
    format: (digits: string) => {
      let formatted = "";
      if (digits.length > 0) formatted += `(${digits.slice(0, 3)}`;
      if (digits.length > 3) formatted += `) ${digits.slice(3, 6)}`;
      if (digits.length > 6) formatted += `-${digits.slice(6)}`;
      return formatted;
    },
  },
  GB: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    },
  },
  CA: {
    digitLength: 10,
    format: (digits: string) => {
      let formatted = "";
      if (digits.length > 0) formatted += `(${digits.slice(0, 3)}`;
      if (digits.length > 3) formatted += `) ${digits.slice(3, 6)}`;
      if (digits.length > 6) formatted += `-${digits.slice(6)}`;
      return formatted;
    },
  },
  AU: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    },
  },
  DE: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  FR: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 1) return digits;
      let formatted = digits.slice(0, 1);
      for (let i = 1; i < digits.length; i += 2) {
        formatted += ` ${digits.slice(i, i + 2)}`;
      }
      return formatted;
    },
  },
  IT: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  ES: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  NL: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  SE: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  CH: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  JP: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    },
  },
  CN: {
    digitLength: 11,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    },
  },
  KR: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    },
  },
  SG: {
    digitLength: 8,
    format: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    },
  },
  MY: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  TH: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  BD: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    },
  },
  SA: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  TR: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  EG: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  ZA: {
    digitLength: 9,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  NG: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
  BR: {
    digitLength: 11,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
    },
  },
  MX: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    },
  },
  AR: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    },
  },
  RU: {
    digitLength: 10,
    format: (digits: string) => {
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    },
  },
};

const PhoneInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    defaultCountry?: string;
    onCountryChange?: (country: (typeof countries)[number]) => void;
    variant?: "light" | "dark";
  }
>(
  (
    {
      className,
      defaultCountry = "PK",
      value,
      onChange,
      onCountryChange,
      onBlur,
      variant = "light",
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = React.useState(
      countries.find((c) => c.code === defaultCountry) || countries[0]
    );
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [touched, setTouched] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleCountrySelect = (country: (typeof countries)[number]) => {
      setSelectedCountry(country);
      setIsOpen(false);
      onCountryChange?.(country);

      // Clear the phone number to just the new dial code when country changes
      const event = {
        target: { value: country.dial },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const prefix = selectedCountry.dial;
      const digitPrefixLen = prefix.length - 1;
      const config = countryConfigs[selectedCountry.code];

      const rawValue = e.target.value.replace(/\D/g, "");
      let phoneDigits = rawValue.slice(digitPrefixLen);

      // Limit digits to max length
      if (phoneDigits.length > config.digitLength) {
        phoneDigits = phoneDigits.slice(0, config.digitLength);
      }

      // Apply country-specific formatting
      const formatted = config.format(phoneDigits);

      // Construct full formatted value with prefix
      const fullFormatted = prefix + (formatted ? " " + formatted : "");

      // Trigger onChange with full formatted value
      onChange?.({ ...e, target: { ...e.target, value: fullFormatted } });
    };

    const filteredCountries = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial.includes(searchQuery)
    );

    // Compute current digits and validity
    const currentValue = (value as string) || "";
    const digitPrefixLen = selectedCountry.dial.length - 1;
    const currentDigits = currentValue.replace(/\D/g, "").slice(digitPrefixLen);
    const config = countryConfigs[selectedCountry.code];
    const isValid =
      currentDigits.length === config.digitLength &&
      (!config.validPrefixes ||
        config.validPrefixes.some((p) => currentDigits.startsWith(p)));
    const showError = touched && currentDigits.length > 0 && !isValid;

    const isDark = variant === "dark";

    return (
      <div ref={wrapperRef} className="relative w-full">
        <div className="flex items-stretch w-full">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 h-10 px-3 border border-r-0 rounded-l-md hover:bg-accent transition-colors shrink-0",
              isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-background border-input"
            )}
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <ChevronDown className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-muted-foreground")} />
          </button>
          <Input
            ref={ref}
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            onBlur={(e) => {
              setTouched(true);
              onBlur?.(e);
            }}
            placeholder="Please enter your phone number"
            className={cn(
              "rounded-l-none",
              className,
              showError && "border-red-500 focus-visible:ring-red-500",
              isDark ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-orange-500" : ""
            )}
            aria-invalid={showError ? "true" : "false"}
            {...props}
          />
        </div>
        {/* {showError && (
          <p className="text-red-500 text-xs mt-1">
            Invalid phone number format for {selectedCountry.name}
          </p>
        )} */}
        {isOpen && (
          <div className={cn(
            "absolute top-full left-0 mt-1 w-full max-w-xs border rounded-md shadow-lg z-50",
            isDark ? "bg-accent-foreground border-white/10 text-white" : "bg-background border-input"
          )}>
            <div className="p-2">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isDark ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400" : ""}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors text-left",
                    isDark ? "hover:bg-white/5 text-white" : ""
                  )}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className={cn("text-sm", isDark ? "text-gray-400" : "text-muted-foreground")}>
                    {country.dial}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { Input, PhoneInput };