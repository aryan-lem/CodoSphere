/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  


  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('http://res.cloudinary.com/dlrs7hrhx/image/upload/v1717886850/Image/alxv2pikfxqsllpmrq0y.png')",
      },
      backgroundSize: {
        'auto': 'auto',  
        'cover': 'cover',
        'contain': 'contain',
        '100': '100%',
        '50': '50%',
      },
      backgroundPosition: {
        'center': 'center',
        'top': 'top',
        'right': 'right',
        'bottom': 'bottom',
        'left': 'left',
      },
      backgroundAttachment: {
        'fixed': 'fixed', // Adding 'fixed' background attachment
      },
    },
  },


  
  plugins: [],
}



