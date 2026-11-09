import { IPgTextContentRecord } from '../app/models/state.interface';

export const PAGE_TEXT_CONTENT: IPgTextContentRecord = {
    gallery: {
        hero: {
            eyebrow: 'VISUAL PORTFOLIO',
            title: 'The Gallery',
            description: 'Explore our signature transformations, vibrant balayage artistry, and precision styling creations.'
        }
    },
    services: {
        hero: {
            eyebrow: 'EXCLUSIVE MENU',
            title: 'Salon Services & Pricing',
            description: 'Indulge in our curated selection of precision cuts, dimensional coloring, and restorative hair treatments.'
        }
    },
    about: {
        hero: {
            eyebrow: 'BESPOKE HAIR ARTISTRY',
            title: 'The Art of Elegance',
            description: 'Welcome to The Scarlett Touch, where modern sophistication meets timeless luxury. Our master stylists curate bespoke experiences designed to elevate your natural beauty.'
        },
        sections: [
            {
                title: 'A Sanctuary of Style & Renewal',
                paragraphs: [
                    'Founded on the principle that hair care is an intimate art form, The Scarlett Touch provides an exclusive sanctuary from the everyday. We combine cutting-edge color techniques with restorative treatments in an atmosphere of serene luxury.',
                    'Every consultation is tailored to your unique lifestyle and aesthetic vision, ensuring a result that is effortlessly radiant.'
                ],
                image: '/assets/images/about-sanctuary.jpg' // Example optional asset
            }
        ]
    },
    home: {
        hero: {
            title: '',
            description: ''
        }
    }
};