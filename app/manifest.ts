import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Practice HQ',
    short_name: 'Practice HQ',
    description: 'The essential platform for connecting lessons and practice to drive measurable growth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#171717',
    theme_color: '#14b8a6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['education', 'music', 'private lessons', 'practice', 'students', 'teachers'],
    lang: 'en-US',
  }
}