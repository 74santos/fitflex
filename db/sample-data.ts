import { hash } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: "",
      role: "admin",
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: "",
      role: "user",
    },
  ],
  products: [
    // GYM EQUIPMENT
    {
      name: "TreadMaster Pro",
      slug: "treadmaster-pro",
      category: "Cardio Equipment",
      description:
        "High-performance treadmill with digital coaching and incline support.",
      images: [
        "/images/fitFlex-products/p1-1.jpg",
        "/images/fitFlex-products/p2-1.jpg",
      ],
      price: 1299.99,
      brand: "FitFlex",
      rating: 4.8,
      numReviews: 24,
      stock: 5,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      name: "SpinRide Elite",
      slug: "spinride-elite",
      category: "Cardio Equipment",
      description:
        "Smart indoor bike with HD touchscreen for immersive workouts.",
      images: [
        "/images/fitFlex-products/p1-2.jpg",
        "/images/fitFlex-products/p2-2.jpg",
      ],
      price: 999.0,
      brand: "FitFlex",
      rating: 4.6,
      numReviews: 19,
      stock: 3,
      isFeatured: true,
      banner: "banner-2.jpg",
    },
    {
      name: "All-In-One Gym Station",
      slug: "all-in-one-gym-station",
      category: "Home Gym",
      description:
        "Multi-function home gym system with adjustable cables and press arms.",
      images: [
        "/images/fitFlex-products/p1-3.jpg",
        "/images/fitFlex-products/p2-3.jpg",
      ],
      price: 1599.5,
      brand: "FitFlex",
      rating: 4.9,
      numReviews: 11,
      stock: 2,
      isFeatured: false,
      banner: null,
    },
    {
      name: "PowerTower Max",
      slug: "powertower-max",
      category: "Bodyweight Equipment",
      description:
        "Pull-up, dip, and knee raise station for upper body workouts.",
      images: [
        "/images/fitFlex-products/p6-1.jpg",
        "/images/fitFlex-products/p6-2.jpg",
      ],
      price: 329.0,
      brand: "FitFlex",
      rating: 4.7,
      numReviews: 14,
      stock: 9,
      isFeatured: true,
      banner: "banner-2.jpg",
    },

    // NUTRITION
    {
      name: "FitFlex Nutrition",
      slug: "fitflex-nutrition",
      category: "Supplements",
      description:
        "High-quality whey isolate for lean muscle and fast recovery.",
      images: [
        "/images/fitFlex-products/p4-1.jpg",
        "/images/fitFlex-products/p4-2.jpg",
      ],
      price: 49.95,
      brand: "FitFlex Nutrition",
      rating: 4.7,
      numReviews: 21,
      stock: 15,
      isFeatured: true,
      banner: "banner-3.jpg",
    },

    // CLOTHING
    {
      name: "FlexTech Compression Shirt",
      slug: "flextech-compression-shirt",
      category: "Men's Activewear",
      description:
        "Breathable, moisture-wicking compression shirt for intense training.",
      images: [
        "/images/fitFlex-products/p3-1.jpg",
        "/images/fitFlex-products/p3-3.jpg",
      ],
      price: 39.99,
      brand: "FitFlex",
      rating: 4.3,
      numReviews: 17,
      stock: 20,
      isFeatured: true,
      banner: null,
    },
    {
      name: "Performance Joggers",
      slug: "performance-joggers",
      category: "Men's Activewear",
      description: "Lightweight joggers with 4-way stretch and zip pockets.",
      images: [
        "/images/fitFlex-products/p3-2.jpg",
        "/images/fitFlex-products/p3-3.jpg",
      ],
      price: 59.5,
      brand: "FitFlex",
      rating: 4.6,
      numReviews: 10,
      stock: 18,
      isFeatured: false,
      banner: null,
    },
    {
      name: "FitFlex Training Hoodie",
      slug: "fitflex-training-hoodie",
      category: "Men's Activewear",
      description:
        "Fleece-lined hoodie for warm-ups, cool-downs, and everyday wear.",
      images: [
        "/images/products/hoodie-1.jpg",
        "/images/products/hoodie-2.jpg",
      ],
      price: 69.99,
      brand: "FitFlex",
      rating: 4.8,
      numReviews: 25,
      stock: 8,
      isFeatured: true,
      banner: null,
    },

    // SUPPLEMENTS
    {
      name: "NeuroEdge Memory Support",
      slug: "neuroedge-memory-support",
      category: "Supplements",
      description:
        "Nootropic blend designed to enhance focus, clarity, and memory.",
      images: [
        "/images/fitFlex-products/p4-1.jpg",
        "/images/fitFlex-products/p4-2.jpg",
      ],
      price: 34.99,
      brand: "FitFlex Labs",
      rating: 4.2,
      numReviews: 13,
      stock: 30,
      isFeatured: false,
      banner: null,
    },
    {
      name: "ISO-X Lean Protein",
      slug: "isox-lean-protein",
      category: "Supplements",
      description:
        "High-quality whey isolate for lean muscle and fast recovery.",
      images: [
        "/images/fitFlex-products/p4-2.jpg",
        "/images/fitFlex-products/p4-1.jpg",
      ],
      price: 49.95,
      brand: "FitFlex Nutrition",
      rating: 4.7,
      numReviews: 21,
      stock: 15,
      isFeatured: true,
      banner: "banner-3.jpg",
    },
    {
      name: "ON Whey Gold Standard",
      slug: "on-whey-gold-standard",
      category: "Supplements",
      description:
        "Trusted whey protein formula for performance and endurance.",
      images: [
        "/images/fitFlex-products/p4-3.jpg",
        "/images/fitFlex-products/p4-2.jpg",
      ],
      price: 64.99,
      brand: "Optimum Nutrition",
      rating: 4.9,
      numReviews: 45,
      stock: 10,
      isFeatured: true,
      banner: null,
    },
  ],
};

export async function getSeedUsers() {
  return await Promise.all(
    sampleData.users.map(async (user) => ({
      ...user,
      password: await hash("password123", 10), // bcrypt salt rounds
    }))
  );
}

export default sampleData;
