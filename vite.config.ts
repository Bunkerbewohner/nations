import { defineConfig } from 'vite'

export default defineConfig({
    base: 'nations/',
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.hdr', '**/*.glb', '**/*.gltf', '**/*.bin', '**/*.env'],
})
