import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
        "dark-gray": "#657786",
        "light-gray": "#AAB8C2",
        "extra-light-gray": "#E1E8ED",
        "extra-extra-light-gray": "#F5F8FA",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "tweet": "15px",
      },
      spacing: {
        "tweet": "1.25rem",
      },
      borderRadius: {
        "tweet": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
