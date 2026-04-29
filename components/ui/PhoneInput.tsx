import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93", flag: "🇦🇫" },
  { code: "AL", name: "Albania", dial: "+355", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CD", name: "Congo (DRC)", dial: "+243", flag: "🇨🇩" },
  { code: "HR", name: "Croatia", dial: "+385", flag: "🇭🇷" },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷" },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", dial: "+36", flag: "🇭🇺" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", dial: "+258", flag: "🇲🇿" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", dial: "+221", flag: "🇸🇳" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "ZM", name: "Zambia", dial: "+260", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼" },
];


const digitsOnly = (s: string) => s.replace(/\D/g, "");

const formatLocal = (digits: string): string => {
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10)
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 13)}`;
};

const toE164 = (dialCode: string, localDigits: string): string => {
  const stripped = localDigits.replace(/^0+/, "");
  return `${dialCode}${stripped}`;
};


type Country = (typeof COUNTRIES)[number];

type Props = {
  label?: string;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
  defaultCountryCode?: string; // ISO alpha-2, e.g. "NG"
  onChange?: (e164: string) => void;
  value?: string; 
};


function PhoneInput({
  label,
  errorMessage,
  className,
  disabled,
  defaultCountryCode = "NG",
  onChange,
}: Props) {
  const defaultCountry =
    COUNTRIES.find((c) => c.code === defaultCountryCode) ?? COUNTRIES[36]; // fallback NG

  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);
  const [localDigits, setLocalDigits] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value);
    const capped = raw.slice(0, 13);
    setLocalDigits(capped);
    setDisplayValue(formatLocal(capped));
    onChange?.(toE164(selectedCountry.dial, capped));
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearch("");
    onChange?.(toE164(country.dial, localDigits));
  };

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative flex w-full">
        {/* ── Country selector trigger ── */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              "flex items-center gap-1.5 h-full px-3",
              "border border-r-0 rounded-l-md border-gray-300 bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "hover:bg-gray-100 transition-colors",
              "text-sm font-medium text-gray-700 whitespace-nowrap",
              { "opacity-60 cursor-not-allowed": disabled },
              { "border-red-400": errorMessage }
            )}
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-gray-500">{selectedCountry.dial}</span>
            <svg
              className={clsx(
                "w-3.5 h-3.5 text-gray-400 transition-transform duration-150",
                { "rotate-180": open }
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* ── Dropdown ── */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search country or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* List */}
              <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">
                    No results
                  </li>
                ) : (
                  filtered.map((country) => (
                    <li key={country.code}>
                      <button
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={clsx(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                          "hover:bg-blue-50 transition-colors text-left",
                          {
                            "bg-blue-50 font-medium":
                              country.code === selectedCountry.code,
                          }
                        )}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="flex-1 text-gray-700">
                          {country.name}
                        </span>
                        <span className="text-gray-400 font-mono text-xs">
                          {country.dial}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Phone number input ── */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="800 000 0000"
          value={displayValue}
          disabled={disabled}
          onChange={handlePhoneChange}
          className={clsx(
            "flex-1 py-2 pl-3 pr-4",
            "border rounded-r-md border-gray-300 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "text-sm text-gray-900",
            {
              "border-red-400 focus:ring-red-400": errorMessage,
              "bg-gray-100 cursor-not-allowed opacity-60": disabled,
            },
            className
          )}
        />
      </div>

      {!!errorMessage && (
        <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default PhoneInput;