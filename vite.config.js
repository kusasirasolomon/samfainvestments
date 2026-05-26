import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                contact: 'contact.html',
                products: 'products.html',
                services: 'services.html',
                admin: resolve(__dirname, 'admin/index3.html')
            }
        }
    }
});