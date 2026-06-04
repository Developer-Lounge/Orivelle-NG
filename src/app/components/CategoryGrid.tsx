import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Laptop, Shirt, Sparkles, Home, Dumbbell, BookOpen, Gamepad2, ShoppingBasket, LucideIcon } from 'lucide-react';
import categoriesData from '../../data/categories.json';

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
  ShoppingBasket,
};

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
      {categoriesData.map((category, index) => {
        const Icon = iconMap[category.icon] || Laptop;
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/category/${category.id}`}
              className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 transition-all group backdrop-blur-sm"
            >
              <motion.div
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 group-hover:from-indigo-500 group-hover:to-indigo-600 text-neutral-700 dark:text-neutral-300 group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/50"
                whileHover={{ rotate: 12 }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs text-center font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{category.name}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
