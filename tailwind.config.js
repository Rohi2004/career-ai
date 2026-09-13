/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8fafc',
        'bg-tertiary': '#f1f5f9',
        'text-primary': '#0f172a',
        'text-secondary': '#475569',
        'text-light': '#94a3b8',
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
        'accent-blue-light': '#eff6ff',
        'accent-purple-light': '#f5f3ff',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-radial-blue': 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        'gradient-radial-purple': 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
        'icon-gradient': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      },
      boxShadow: {
        'btn-primary': '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
        'btn-primary-hover': '0 6px 20px rgba(59, 130, 246, 0.23)',
      },
    },
  },
  plugins: [],
}
