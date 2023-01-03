module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    colors: {
      black: "#000000",
      gray: "#C2C2C2",
      white: "#FFFFFF",
      primary: "#5E5EDD",
      accent: "#D453B6",
      success: "#01944C",
      error: "#EB0000",
      "light-black": "#484848",
      "light-gray": "#F8F8F8",
      "mid-gray": "#E9E9E9",
    },
    borderRadius: {
      sm: "5px",
    },
    boxShadow: {
      lg: "0px 8px 8px rgba(0, 0, 0, 0.024)",
      sm: "0px 4px 4px rgba(0, 0, 0, 0.024)",
    },
    fontSize: {
      xs: [".75rem", { lineHeight: "1rem" }],
      sm: ["0.877rem", { lineHeight: "1.5rem" }],
      md: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.5rem", { lineHeight: "2rem" }],
    },
    fontWeight: {
      heavy: "700",
      bold: "500",
      "almost-bold": "450",
    },
  },
  plugins: [],
};
