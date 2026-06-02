import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface BannerData {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
}

const banners: BannerData[] = [
  {
    id: '1',
    title: 'Premium Headphones',
    description: 'Experience crystal-clear sound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    ctaText: 'Shop Now',
    ctaLink: '/',
    backgroundColor: '#1e293b',
  },
  {
    id: '2',
    title: 'Smart Watches',
    description: 'Track your fitness goals',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    ctaText: 'Explore',
    ctaLink: '/',
    backgroundColor: '#7c3aed',
  },
  {
    id: '3',
    title: 'Home Essentials',
    description: 'Up to 50% off',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    ctaText: 'View Deals',
    ctaLink: '/',
    backgroundColor: '#ea580c',
  },
];

export function AdvertBanner() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            to={banner.ctaLink}
            className="relative block h-64 rounded-2xl overflow-hidden group"
            style={{ backgroundColor: banner.backgroundColor }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
            />
            <div className="relative h-full flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl mb-2">{banner.title}</h3>
              <p className="text-sm text-gray-200 mb-4">{banner.description}</p>
              <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                <span className="text-sm">{banner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
