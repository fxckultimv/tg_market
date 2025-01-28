import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    base: '/',
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 3000, // Изменён порт на стандартный 3000
        host: true, // Позволяет прослушивать все IP-адреса (нужно для Docker)
    },
    publicDir: './public',
})
