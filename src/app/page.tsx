import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";

export default async function Home() {
  const latestProducts = await prisma.product.findMany({
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex items-center gap-12 py-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-rose-900">
            Discover Unique and Beautiful Earrings
          </h1>
          <p className="text-lg text-rose-700 leading-relaxed">
            Welcome to Elegant Earrings, where each piece tells a story. Our
            carefully curated collection features handcrafted earrings that
            combine traditional craftsmanship with modern design.
          </p>
          <Link
            href="/products"
            className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
          >
            Explore Collection
          </Link>
        </div>
        <div className="flex-1 relative h-[400px]">
          <Image
            src="/earings/home-page.png"
            alt="Elegant earrings collection"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white p-8 rounded-xl shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-rose-900">About Us</h2>
          <p className="text-rose-700 leading-relaxed">
            Since 2020, we've been passionate about creating and curating the
            finest earrings for our discerning customers. Each piece in our
            collection is selected for its unique design, quality craftsmanship,
            and ability to make you feel special.
          </p>
        </div>
      </section>

      {/* Latest Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-rose-900">Latest Arrivals</h2>
          <Link href="/products" className="text-rose-600 hover:text-rose-700">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Handcrafted Quality",
            description:
              "Each piece is carefully crafted with attention to detail.",
          },
          {
            title: "Free Shipping",
            description: "Enjoy free shipping on all orders over $50.",
          },
          {
            title: "30-Day Returns",
            description:
              "Not satisfied? Return within 30 days for a full refund.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-rose-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-rose-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
