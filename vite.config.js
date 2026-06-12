const { defineConfig } = require('vite')
const path = require('path')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                about: path.resolve(__dirname, 'about.html'),
                contact: path.resolve(__dirname, 'contact.html'),
                products: path.resolve(__dirname, 'products.html'),
                services: path.resolve(__dirname, 'services.html'),
                admin: path.resolve(__dirname, 'mysamfaadmint/index.html'),
                stationery: path.resolve(__dirname, 'stationery.html'),
                salon: path.resolve(__dirname, 'salon.html'),
                

            }
        }
    }
})