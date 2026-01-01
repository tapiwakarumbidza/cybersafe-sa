/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // South African flag inspired palette
        'sa-green': '#007A4D',
        'sa-gold': '#FFB81C',
        'sa-red': '#DE3831',
        'sa-blue': '#002395',
        // Risk level colors
        'risk-low': '#10B981',
        'risk-medium': '#F59E0B',
        'risk-high': '#EF4444',
      },
    },
  },
  plugins: [],
}
