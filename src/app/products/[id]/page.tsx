// app/products/[id]/page.tsx
import { client } from "../../../sanity/lib/client";
import { notFound } from "next/navigation";
import Link from "next/link";

const productQuery = `
  *[_type == "product" && _id == $id][0]{
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

type PageProps = {
  params: {
    id: string;
  };
};

async function getProduct(id: string): Promise<Product | null> {
  return await client.fetch(productQuery, { id });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in ${product.name}`);
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMessage}`;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-8 py-12 max-w-4xl">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300 mb-8"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <span 
                  className="text-3xl lg:text-4xl font-bold"
                  style={{ color: '#e87b51' }}
                >
                  ${product.price}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: '#e87b51'
                }}
              >
                <svg 
                  className="w-6 h-6 mr-3" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                Contact on WhatsApp
              </a>
            </div>

            {/* Product ID (for reference) */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Product ID: {product._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - $${product.price}`,
    description: product.description,
  };
}