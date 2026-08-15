import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandThemeContextType {
  brandSmokeEnabled: boolean;
  toggleBrandSmoke: () => void;
  setBrandSmokeEnabled: (enabled: boolean) => void;
}

const BrandThemeContext = createContext<BrandThemeContextType>({
  brandSmokeEnabled: true,
  toggleBrandSmoke: () => {},
  setBrandSmokeEnabled: () => {},
});

export const BrandThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandSmokeEnabled, setBrandSmokeEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brand_smoke_effect');
      if (saved !== null) return saved === 'true';
    }
    return true; // Default to ON for the new design overhaul
  });

  useEffect(() => {
    localStorage.setItem('brand_smoke_effect', String(brandSmokeEnabled));
  }, [brandSmokeEnabled]);

  const toggleBrandSmoke = () => setBrandSmokeEnabledState(prev => !prev);
  const setBrandSmokeEnabled = (enabled: boolean) => setBrandSmokeEnabledState(enabled);

  return (
    <BrandThemeContext.Provider value={{ brandSmokeEnabled, toggleBrandSmoke, setBrandSmokeEnabled }}>
      {children}
    </BrandThemeContext.Provider>
  );
};

export const useBrandTheme = () => useContext(BrandThemeContext);
