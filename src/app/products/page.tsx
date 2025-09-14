"use client";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { client } from "../../sanity/lib/client";
import Link from "next/link";

const productsQuery = `
  *[_type == "product"]{
    _id,
    name,
    price,
    description,
    "imageUrl": image.asset->url
  }
`;

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

// Container animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Card animation variants
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Image animation variants
const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Card hover variants
const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 25px 50px -12px rgba(232, 123, 81, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.3)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await client.fetch(productsQuery);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#e87b51' }}></div>
          <p className="text-gray-300">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#e87b51' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            🛍 Our Products
          </h1>
          <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#e87b51' }}></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={cardVariants}
              whileHover="hover"
              initial="rest"
              className="group"
            >
              <Link href={`/products/${product._id}`}>
                <motion.div
                  variants={cardHoverVariants}
                  className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-white/20 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(232,123,81,0.05) 100%)',
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6 bg-white/5 flex-shrink-0">
                    <motion.img
                      src={product.imageUrl}
                      alt={product.name}
                      variants={imageVariants}
                      className="h-48 w-full object-contain transition-transform duration-400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors duration-300">
                      {product.name}
                    </h2>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <motion.p
                        className="text-2xl font-bold"
                        style={{ color: '#e87b51' }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        Rs : {product.price}
                      </motion.p>
                      
                      <motion.span
                        className="px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium"
                        style={{ 
                          borderColor: '#e87b51',
                          color: '#e87b51',
                        }}
                        whileHover={{
                          backgroundColor: '#e87b51',
                          color: 'white',
                          scale: 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        View Details
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}