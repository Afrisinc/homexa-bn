import { logger } from '@/utils/logger.js';
import prisma from './prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    logger.info('Starting database seeding...');

    // Clear existing data (optional - comment out if you want to preserve data)
    // await prisma.review.deleteMany({});
    // await prisma.productVariant.deleteMany({});
    // await prisma.product.deleteMany({});
    // await prisma.vendor.deleteMany({});
    // await prisma.category.deleteMany({});
    // await prisma.user.deleteMany({});

    // Create Seller Users
    logger.info('Creating seller users...');
    const hashedPassword = await bcrypt.hash('SellerPassword123!', 10);
    const sellers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'samsung.seller@homexa.com',
          password: hashedPassword,
          firstName: 'Samsung',
          lastName: 'Seller',
          phone: '+1-800-SAMSUNG',
          role: 'SELLER',
        },
      }),
      prisma.user.create({
        data: {
          email: 'apple.seller@homexa.com',
          password: hashedPassword,
          firstName: 'Apple',
          lastName: 'Seller',
          phone: '+1-800-MY-APPLE',
          role: 'SELLER',
        },
      }),
      prisma.user.create({
        data: {
          email: 'generic.seller@homexa.com',
          password: hashedPassword,
          firstName: 'Generic',
          lastName: 'Seller',
          phone: '+1-800-GENERIC',
          role: 'SELLER',
        },
      }),
    ]);

    logger.info(`Created ${sellers.length} seller users`);

    // Create Categories
    logger.info('Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and accessories',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop',
          imageAltText: 'Electronics category',
          metaTitle: 'Electronics - Best Gadgets & Devices',
          metaDescription: 'Shop the latest electronic devices and accessories',
          seoKeywords: ['electronics', 'gadgets', 'devices'],
          displayOrder: 1,
          isFeatured: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Latest smartphones and mobile devices',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
          imageAltText: 'Smartphones category',
          metaTitle: 'Smartphones - Latest Models',
          metaDescription: 'Browse the latest smartphones and mobile phones',
          seoKeywords: ['smartphones', 'mobile', 'phones'],
          displayOrder: 2,
          isFeatured: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Laptops & Computers',
          slug: 'laptops-computers',
          description: 'Desktop and laptop computers',
          status: 'active',
          imageUrl: 'https://via.placeholder.com/300?text=Laptops',
          imageAltText: 'Laptops & Computers category',
          metaTitle: 'Laptops & Computers - High Performance',
          metaDescription: 'Shop powerful laptops and desktop computers',
          seoKeywords: ['laptops', 'computers', 'desktop'],
          displayOrder: 3,
          isFeatured: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Accessories',
          slug: 'accessories',
          description: 'Electronic accessories and peripherals',
          status: 'active',
          imageUrl: 'https://via.placeholder.com/300?text=Accessories',
          imageAltText: 'Accessories category',
          metaTitle: 'Accessories - Cables, Chargers & More',
          metaDescription: 'Find all electronic accessories and peripherals',
          seoKeywords: ['accessories', 'chargers', 'cables'],
          displayOrder: 4,
          isFeatured: false,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Audio & Speakers',
          slug: 'audio-speakers',
          description: 'Headphones, speakers, and audio equipment',
          status: 'active',
          imageUrl: 'https://via.placeholder.com/300?text=Audio',
          imageAltText: 'Audio & Speakers category',
          metaTitle: 'Audio & Speakers - Premium Sound',
          metaDescription: 'High-quality headphones, speakers and audio devices',
          seoKeywords: ['audio', 'headphones', 'speakers'],
          displayOrder: 5,
          isFeatured: false,
        },
      }),
    ]);

    logger.info(`Created ${categories.length} categories`);

    // Create Vendors
    logger.info('Creating vendors...');
    const vendors = await Promise.all([
      prisma.vendor.create({
        data: {
          name: 'Samsung Electronics',
          slug: 'samsung-electronics',
          description: 'Official Samsung electronics',
          logo: 'https://via.placeholder.com/100?text=Samsung',
          email: 'contact@samsung.com',
          phone: '+1-800-SAMSUNG',
          website: 'https://samsung.com',
          status: 'active',
        },
      }),
      prisma.vendor.create({
        data: {
          name: 'Apple Inc',
          slug: 'apple-inc',
          description: 'Official Apple products',
          logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
          email: 'contact@apple.com',
          phone: '+1-800-MY-APPLE',
          website: 'https://apple.com',
          status: 'active',
        },
      }),
    ]);

    logger.info(`Created ${vendors.length} vendors`);

    // Create Products
    logger.info('Creating products...');
    const products = await Promise.all([
      // Smartphones
      prisma.product.create({
        data: {
          name: 'Samsung Galaxy A25',
          slug: 'samsung-galaxy-a25',
          description: 'Latest mid-range smartphone with 8GB RAM and 128GB storage',
          sku: 'SKU-001',
          barcode: '8997665532111',
          price: 249.99,
          compareAtPrice: 299.99,
          discountPercent: 17,
          currency: 'USD',
          categoryId: categories[1].id,
          sellerId: sellers[0].id,
          vendorId: vendors[0].id,
          brand: 'Samsung',
          model: 'Galaxy A25',
          stockQuantity: 150,
          allowBackorder: true,
          warehouseLocation: 'WH-A-01',
          images: [
            'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
            'https://via.placeholder.com/400?text=Samsung+Galaxy+A25+Side',
          ],
          weight: '0.195kg',
          length: '16.2cm',
          width: '7.6cm',
          height: '0.8cm',
          attributes: {
            color: 'Black',
            ram: '8GB',
            storage: '128GB',
            battery: '5000mAh',
            display: '6.5 inches',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['smartphone', 'android', 'budget-friendly'],
          metaTitle: 'Samsung Galaxy A25 - Affordable Smartphone',
          metaDescription: 'Buy Samsung Galaxy A25 with 8GB RAM and 128GB storage',
          seoKeywords: ['samsung galaxy a25', 'smartphone', 'affordable'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          description: 'Premium smartphone with advanced camera and A17 chip',
          sku: 'SKU-002',
          barcode: '1234567890123',
          price: 999.99,
          compareAtPrice: 1099.99,
          discountPercent: 9,
          currency: 'USD',
          categoryId: categories[1].id,
          sellerId: sellers[1].id,
          vendorId: vendors[1].id,
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          stockQuantity: 80,
          allowBackorder: false,
          warehouseLocation: 'WH-A-02',
          images: [
            'https://via.placeholder.com/400?text=iPhone+15+Pro',
            'https://via.placeholder.com/400?text=iPhone+15+Pro+Back',
          ],
          weight: '0.187kg',
          length: '14.6cm',
          width: '7cm',
          height: '0.84cm',
          attributes: {
            color: 'Titanium Black',
            storage: '256GB',
            battery: '3274mAh',
            display: '6.1 inches',
            processor: 'A17 Pro',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['smartphone', 'premium', 'ios'],
          metaTitle: 'iPhone 15 Pro - Latest Apple Smartphone',
          metaDescription: 'Premium iPhone 15 Pro with advanced camera system',
          seoKeywords: ['iphone 15 pro', 'apple', 'premium smartphone'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Samsung Galaxy Z Fold 5',
          slug: 'samsung-galaxy-z-fold-5',
          description: 'Foldable smartphone with innovative design and powerful performance',
          sku: 'SKU-003',
          barcode: '8997665532222',
          price: 1799.99,
          compareAtPrice: 1999.99,
          discountPercent: 10,
          currency: 'USD',
          categoryId: categories[1].id,
          sellerId: sellers[0].id,
          vendorId: vendors[0].id,
          brand: 'Samsung',
          model: 'Galaxy Z Fold 5',
          stockQuantity: 45,
          allowBackorder: true,
          warehouseLocation: 'WH-A-03',
          images: ['https://via.placeholder.com/400?text=Galaxy+Z+Fold+5'],
          weight: '0.253kg',
          attributes: {
            color: 'Phantom Black',
            ram: '12GB',
            storage: '256GB',
            display: '7.6 inches folded',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['smartphone', 'foldable', 'premium'],
          metaTitle: 'Samsung Galaxy Z Fold 5 - Foldable Phone',
          metaDescription: 'Revolutionary foldable smartphone with cutting-edge technology',
          seoKeywords: ['foldable', 'samsung', 'z fold 5'],
        },
      }),

      // Laptops
      prisma.product.create({
        data: {
          name: 'MacBook Pro 16-inch',
          slug: 'macbook-pro-16-inch',
          description: 'Powerful laptop with M3 Max chip and stunning display',
          sku: 'SKU-004',
          barcode: '1234567890124',
          price: 2499.99,
          compareAtPrice: 2799.99,
          discountPercent: 11,
          currency: 'USD',
          categoryId: categories[2].id,
          sellerId: sellers[1].id,
          vendorId: vendors[1].id,
          brand: 'Apple',
          model: 'MacBook Pro 16"',
          stockQuantity: 35,
          allowBackorder: false,
          warehouseLocation: 'WH-B-01',
          images: ['https://via.placeholder.com/400?text=MacBook+Pro+16'],
          weight: '2.15kg',
          length: '35.7cm',
          width: '24.8cm',
          height: '1.55cm',
          attributes: {
            color: 'Space Black',
            processor: 'M3 Max',
            ram: '36GB',
            storage: '1TB SSD',
            display: '16-inch Liquid Retina XDR',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['laptop', 'apple', 'professional'],
          metaTitle: 'MacBook Pro 16-inch - Professional Laptop',
          metaDescription: 'Powerful MacBook Pro with M3 Max chip for professionals',
          seoKeywords: ['macbook pro', 'laptop', '16 inch'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Dell XPS 15',
          slug: 'dell-xps-15',
          description: 'Premium Windows laptop with Intel i9 and RTX 4090',
          sku: 'SKU-005',
          barcode: '1234567890125',
          price: 2199.99,
          compareAtPrice: 2599.99,
          discountPercent: 15,
          currency: 'USD',
          categoryId: categories[2].id,
          sellerId: sellers[2].id,
          stockQuantity: 50,
          allowBackorder: true,
          warehouseLocation: 'WH-B-02',
          images: ['https://via.placeholder.com/400?text=Dell+XPS+15'],
          weight: '2.0kg',
          attributes: {
            color: 'Platinum Silver',
            processor: 'Intel i9-13900H',
            ram: '32GB',
            storage: '1TB SSD',
            gpu: 'RTX 4090',
            display: '15.6-inch OLED',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['laptop', 'windows', 'gaming'],
          metaTitle: 'Dell XPS 15 - Premium Gaming Laptop',
          metaDescription: 'High-performance Dell XPS 15 with RTX 4090',
          seoKeywords: ['dell xps 15', 'laptop', 'gaming'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Lenovo ThinkPad X1 Carbon',
          slug: 'lenovo-thinkpad-x1-carbon',
          description: 'Business laptop with exceptional durability and performance',
          sku: 'SKU-006',
          barcode: '1234567890126',
          price: 1599.99,
          compareAtPrice: 1799.99,
          discountPercent: 11,
          currency: 'USD',
          categoryId: categories[2].id,
          sellerId: sellers[2].id,
          stockQuantity: 60,
          allowBackorder: true,
          warehouseLocation: 'WH-B-03',
          images: ['https://via.placeholder.com/400?text=ThinkPad+X1+Carbon'],
          weight: '1.57kg',
          attributes: {
            color: 'Black',
            processor: 'Intel i7-1365U',
            ram: '16GB',
            storage: '512GB SSD',
            display: '14-inch OLED',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: false,
          taxRate: 10,
          tags: ['laptop', 'business', 'portable'],
          metaTitle: 'Lenovo ThinkPad X1 Carbon - Business Laptop',
          metaDescription: 'Durable and portable ThinkPad for business professionals',
          seoKeywords: ['thinkpad', 'business', 'laptop'],
        },
      }),

      // Audio
      prisma.product.create({
        data: {
          name: 'Sony WH-1000XM5 Headphones',
          slug: 'sony-wh-1000xm5-headphones',
          description: 'Premium noise-cancelling headphones with superior sound',
          sku: 'SKU-007',
          barcode: '1234567890127',
          price: 399.99,
          compareAtPrice: 449.99,
          discountPercent: 11,
          currency: 'USD',
          categoryId: categories[4].id,
          sellerId: sellers[2].id,
          stockQuantity: 120,
          allowBackorder: true,
          warehouseLocation: 'WH-C-01',
          images: ['https://via.placeholder.com/400?text=Sony+WH-1000XM5'],
          weight: '0.25kg',
          attributes: {
            color: 'Black',
            type: 'Over-Ear',
            noiseCancellation: 'ANC',
            batteryLife: '30 hours',
            connectivity: 'Bluetooth 5.3',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['audio', 'headphones', 'wireless'],
          metaTitle: 'Sony WH-1000XM5 - Noise-Cancelling Headphones',
          metaDescription: 'Premium Sony headphones with industry-leading noise cancellation',
          seoKeywords: ['sony headphones', 'noise cancelling', 'audio'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Apple AirPods Pro',
          slug: 'apple-airpods-pro',
          description: 'Wireless earbuds with active noise cancellation',
          sku: 'SKU-008',
          barcode: '1234567890128',
          price: 249.99,
          compareAtPrice: 299.99,
          discountPercent: 17,
          currency: 'USD',
          categoryId: categories[4].id,
          sellerId: sellers[1].id,
          vendorId: vendors[1].id,
          stockQuantity: 200,
          allowBackorder: true,
          warehouseLocation: 'WH-C-02',
          images: ['https://via.placeholder.com/400?text=AirPods+Pro'],
          weight: '0.05kg',
          attributes: {
            color: 'White',
            type: 'In-Ear',
            noiseCancellation: 'ANC',
            batteryLife: '6 hours',
            charging: 'MagSafe',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['audio', 'earbuds', 'apple'],
          metaTitle: 'Apple AirPods Pro - Premium Earbuds',
          metaDescription: 'Latest Apple AirPods Pro with enhanced noise cancellation',
          seoKeywords: ['airpods pro', 'wireless earbuds', 'apple audio'],
        },
      }),

      // Accessories
      prisma.product.create({
        data: {
          name: 'USB-C Fast Charging Cable',
          slug: 'usb-c-fast-charging-cable',
          description: '2-meter USB-C cable with 65W fast charging support',
          sku: 'SKU-009',
          barcode: '1234567890129',
          price: 14.99,
          compareAtPrice: 19.99,
          discountPercent: 25,
          currency: 'USD',
          categoryId: categories[3].id,
          sellerId: sellers[2].id,
          stockQuantity: 500,
          allowBackorder: true,
          warehouseLocation: 'WH-D-01',
          images: ['https://via.placeholder.com/400?text=USB-C+Cable'],
          weight: '0.05kg',
          attributes: {
            color: 'Black',
            length: '2m',
            connector: 'USB-C to USB-C',
            maxPower: '65W',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: false,
          taxRate: 10,
          tags: ['accessory', 'cable', 'charging'],
          metaTitle: 'USB-C Fast Charging Cable - 2m',
          metaDescription: 'High-speed USB-C cable with 65W charging support',
          seoKeywords: ['usb-c cable', 'charging cable', 'fast charge'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Wireless Phone Charger',
          slug: 'wireless-phone-charger',
          description: '15W wireless charging pad compatible with all Qi devices',
          sku: 'SKU-010',
          barcode: '1234567890130',
          price: 29.99,
          compareAtPrice: 39.99,
          discountPercent: 25,
          currency: 'USD',
          categoryId: categories[3].id,
          sellerId: sellers[2].id,
          stockQuantity: 300,
          allowBackorder: true,
          warehouseLocation: 'WH-D-02',
          images: ['https://via.placeholder.com/400?text=Wireless+Charger'],
          weight: '0.15kg',
          attributes: {
            color: 'White',
            power: '15W',
            compatibility: 'Qi-enabled devices',
            material: 'Silicone',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: false,
          taxRate: 10,
          tags: ['accessory', 'charger', 'wireless'],
          metaTitle: 'Wireless Phone Charger - 15W Fast Charging',
          metaDescription: 'Universal Qi wireless charger for all compatible phones',
          seoKeywords: ['wireless charger', 'qi charger', 'phone charger'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Premium Phone Case',
          slug: 'premium-phone-case',
          description: 'Protective smartphone case with premium materials',
          sku: 'SKU-011',
          barcode: '1234567890131',
          price: 24.99,
          compareAtPrice: 34.99,
          discountPercent: 29,
          currency: 'USD',
          categoryId: categories[3].id,
          sellerId: sellers[2].id,
          stockQuantity: 400,
          allowBackorder: true,
          warehouseLocation: 'WH-D-03',
          images: ['https://via.placeholder.com/400?text=Phone+Case'],
          weight: '0.08kg',
          attributes: {
            color: 'Black',
            material: 'TPU + PC',
            protection: 'Military Grade',
            compatibility: 'Universal fit',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: false,
          taxRate: 10,
          tags: ['accessory', 'case', 'protection'],
          metaTitle: 'Premium Phone Case - Military Grade Protection',
          metaDescription: 'Durable phone case with advanced protection technology',
          seoKeywords: ['phone case', 'protective case', 'phone protection'],
        },
      }),
      prisma.product.create({
        data: {
          name: 'Portable Power Bank 20000mAh',
          slug: 'portable-power-bank-20000mah',
          description: 'High-capacity portable battery with dual USB ports',
          sku: 'SKU-012',
          barcode: '1234567890132',
          price: 44.99,
          compareAtPrice: 59.99,
          discountPercent: 25,
          currency: 'USD',
          categoryId: categories[3].id,
          sellerId: sellers[2].id,
          stockQuantity: 250,
          allowBackorder: true,
          warehouseLocation: 'WH-D-04',
          images: ['https://via.placeholder.com/400?text=Power+Bank'],
          weight: '0.36kg',
          attributes: {
            color: 'Black',
            capacity: '20000mAh',
            ports: '2x USB-A + 1x USB-C',
            fastCharging: '65W',
            weight: '360g',
          },
          status: 'active',
          visibility: true,
          returnable: true,
          isFeatured: true,
          taxRate: 10,
          tags: ['accessory', 'powerbank', 'portable'],
          metaTitle: 'Power Bank 20000mAh - Dual USB Ports',
          metaDescription: 'High-capacity power bank with fast charging support',
          seoKeywords: ['power bank', 'portable charger', 'battery'],
        },
      }),
    ]);

    logger.info(`Created ${products.length} products`);

    // Create some product variants (optional)
    logger.info('Creating product variants...');
    await prisma.productVariant.create({
      data: {
        productId: products[0].id,
        sku: 'SKU-001-WHITE',
        name: 'White 128GB',
        price: 249.99,
        stockQuantity: 50,
        attributes: {
          color: 'White',
          storage: '128GB',
        },
        images: ['https://via.placeholder.com/400?text=Galaxy+A25+White'],
      },
    });

    await prisma.productVariant.create({
      data: {
        productId: products[0].id,
        sku: 'SKU-001-BLUE',
        name: 'Blue 128GB',
        price: 249.99,
        stockQuantity: 60,
        attributes: {
          color: 'Blue',
          storage: '128GB',
        },
        images: ['https://via.placeholder.com/400?text=Galaxy+A25+Blue'],
      },
    });

    logger.info('Seeding completed successfully!');
    logger.info(`Created:
      - ${sellers.length} seller users
      - ${categories.length} categories
      - ${vendors.length} vendors
      - ${products.length} products
      - 2 product variants`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Seeding failed');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
