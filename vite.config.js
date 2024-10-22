import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Ensure globals like expect are available
    environment: 'jsdom', // Use jsdom for testing React components
  },
  // server:{
  //   port:5000,
  //   // proxy:{
  //   //   "/api":{
  //   //     target:"https://eventsapi3a.azurewebsites.net/"
  //   //   }
  //   // }
  // }
})
