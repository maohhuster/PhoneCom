import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Production-safe seed: Idempotent - chỉ tạo data nếu chưa tồn tại
 * KHÔNG xóa data hiện có
 */
async function main() {
    console.log('Starting PRODUCTION seed process (idempotent)...');

    // 0. Create Roles (idempotent)
    const roleNames = ['CUSTOMER', 'STAFF', 'ADMIN', 'GUEST'];
    const roleData = [
        { name: 'CUSTOMER', permissions: ['buy_products'], description: 'Standard user' },
        { name: 'STAFF', permissions: ['manage_orders'], description: 'Staff member' },
        { name: 'ADMIN', permissions: ['manage_all'], description: 'Administrator' },
        { name: 'GUEST', permissions: ['view_products'], description: 'Guest visitor' }
    ];

    const roles: Record<string, any> = {};
    for (let i = 0; i < roleNames.length; i++) {
        // Use findFirst because name is not @unique in schema
        const existing = await prisma.role.findFirst({ where: { name: roleNames[i] } });
        if (existing) {
            roles[roleNames[i]] = existing;
            console.log(`Role ${roleNames[i]} already exists, skipping.`);
        } else {
            roles[roleNames[i]] = await prisma.role.create({ data: roleData[i] });
            console.log(`Role ${roleNames[i]} created.`);
        }
    }

    // 1. Create Users (idempotent - check by email)
    let admin = await prisma.user.findUnique({ where: { email: 'admin@demo.com' } });
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                fullName: 'Admin User',
                email: 'admin@demo.com',
                roleId: roles.ADMIN.id,
            },
        });
        console.log('Admin user created.');
    } else {
        console.log('Admin user already exists, skipping.');
    }

    let staff = await prisma.user.findUnique({ where: { email: 'staff@demo.com' } });
    if (!staff) {
        staff = await prisma.user.create({
            data: {
                fullName: 'Le Thi Staff',
                email: 'staff@demo.com',
                roleId: roles.STAFF.id,
            },
        });
        console.log('Staff user created.');
    } else {
        console.log('Staff user already exists, skipping.');
    }

    const customers = [];
    const customerNames = ['Hao Sao', 'Ko Pin Duy', 'Manh Gay', 'Trinh Gia Man', 'OOOAD'];
    const customerEmails = ['hs@demo.com', 'kpd@demo.com', 'mg@demo.com', 'tgm@demo.com', 'oo@demo.com'];

    for (let i = 0; i < customerNames.length; i++) {
        let customer = await prisma.user.findUnique({ where: { email: customerEmails[i] } });
        if (!customer) {
            customer = await prisma.user.create({
                data: {
                    fullName: customerNames[i],
                    email: customerEmails[i],
                    roleId: roles.CUSTOMER.id,
                    addresses: {
                        create: [
                            {
                                recipientName: customerNames[i],
                                phoneNumber: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
                                line1: `${Math.floor(1 + Math.random() * 500)} Main St`,
                                ward: `Ward ${Math.floor(1 + Math.random() * 10)}`,
                                district: `District ${Math.floor(1 + Math.random() * 5)}`,
                                province: 'Ho Chi Minh',
                                isDefault: true,
                            },
                            {
                                recipientName: customerNames[i],
                                phoneNumber: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
                                line1: `${Math.floor(1 + Math.random() * 500)} Second St`,
                                ward: `Ward ${Math.floor(1 + Math.random() * 10)}`,
                                district: `District ${Math.floor(1 + Math.random() * 5)}`,
                                province: 'Ha Noi',
                                isDefault: false,
                            }
                        ]
                    }
                }
            });
            console.log(`Customer ${customerNames[i]} created.`);
        } else {
            console.log(`Customer ${customerNames[i]} already exists, skipping.`);
        }
        customers.push(customer);
    }

    // 2. Create Products & Variants (idempotent - check by name)
    const productsData = [
        {
            name: 'iPhone 15 Pro',
            brand: 'Apple',
            description: 'The ultimate iPhone. Titanium design. A17 Pro chip.',
            status: 'ACTIVE',
            imageUrl: 'https://images.macrumors.com/article-new/2023/09/iphone-15-pro-gray.jpg',
            variants: [
                { name: '128GB - Natural Titanium', color: 'Natural Titanium', capacity: '128GB', price: 999, stockQuantity: 25, imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.8a8W7WyIsrr1i37DLR9uwAHaL5?rs=1&pid=ImgDetMain&o=7&rm=3' },
                { name: '256GB - Blue Titanium', color: 'Blue Titanium', capacity: '256GB', price: 1099, stockQuantity: 15, imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.8a8W7WyIsrr1i37DLR9uwAHaL5?rs=1&pid=ImgDetMain&o=7&rm=3' },
                { name: '512GB - Black Titanium', color: 'Black Titanium', capacity: '512GB', price: 1299, stockQuantity: 10, imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.8a8W7WyIsrr1i37DLR9uwAHaL5?rs=1&pid=ImgDetMain&o=7&rm=3' }
            ]
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            brand: 'Samsung',
            description: 'Galaxy AI is here. Epic surfing, searching, and translation.',
            status: 'ACTIVE',
            imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.hQVUtnziJeAuUtTx-BKDHQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
            variants: [
                { name: '256GB - Titanium Black', color: 'Titanium Black', capacity: '256GB', price: 1299, stockQuantity: 30, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.hQVUtnziJeAuUtTx-BKDHQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
                { name: '512GB - Titanium Violet', color: 'Titanium Violet', capacity: '512GB', price: 1419, stockQuantity: 12, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.hQVUtnziJeAuUtTx-BKDHQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
                { name: '1TB - Titanium Gray', color: 'Titanium Gray', capacity: '1TB', price: 1599, stockQuantity: 5, imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.hQVUtnziJeAuUtTx-BKDHQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' }
            ]
        },
        {
            name: 'Xiaomi 14 Ultra',
            brand: 'Xiaomi',
            description: 'Lens to Legend. Leica Summilux optical lens.',
            status: 'ACTIVE',
            imageUrl: 'https://i02.appmifile.com/334_operator_sg/22/02/2024/d36105f6de5a716a1c0737352c2827be.png',
            variants: [
                { name: '512GB - Black', color: 'Black', capacity: '512GB', price: 1199, stockQuantity: 20, imageUrl: 'https://i02.appmifile.com/334_operator_sg/22/02/2024/d36105f6de5a716a1c0737352c2827be.png' },
                { name: '512GB - White', color: 'White', capacity: '512GB', price: 1199, stockQuantity: 15, imageUrl: 'https://i02.appmifile.com/334_operator_sg/22/02/2024/d36105f6de5a716a1c0737352c2827be.png' }
            ]
        },
        {
            name: 'Sony Xperia 1 VI',
            brand: 'Sony',
            description: 'The master of photography and entertainment.',
            status: 'ACTIVE',
            imageUrl: 'https://cdn.mos.cms.futurecdn.net/cWG2kiVg3uSeHQKzHuY8wK.jpg',
            variants: [
                { name: '256GB - Platinum Silver', color: 'Platinum Silver', capacity: '256GB', price: 1399, stockQuantity: 8, imageUrl: 'https://cdn.mos.cms.futurecdn.net/cWG2kiVg3uSeHQKzHuY8wK.jpg' },
                { name: '512GB - Khaki Green', color: 'Khaki Green', capacity: '512GB', price: 1499, stockQuantity: 4, imageUrl: 'https://cdn.mos.cms.futurecdn.net/cWG2kiVg3uSeHQKzHuY8wK.jpg' }
            ]
        },
        {
            name: 'Oppo Find X7 Ultra',
            brand: 'Oppo',
            description: 'The first quad-camera system with dual periscope lenses.',
            status: 'ACTIVE',
            imageUrl: 'https://www.vopmart.com/media/wysiwyg/OPPO/oppo-find-x7-ultra-02.jpg',
            variants: [
                { name: '256GB - Ocean Blue', color: 'Ocean Blue', capacity: '256GB', price: 999, stockQuantity: 15, imageUrl: 'https://www.oppo.com/content/dam/oppo/common/mkt/v2-2/find-x7-series-cn/listpage/find-x7-ultra-427_600-blue.png' },
                { name: '512GB - Sepia Brown', color: 'Sepia Brown', capacity: '512GB', price: 1099, stockQuantity: 8, imageUrl: 'https://www.oppo.com/content/dam/oppo/common/mkt/v2-2/find-x7-series-cn/listpage/find-x7-ultra-427_600-blue.png' }
            ]
        }
    ];

    const createdVariants: any[] = [];

    for (const p of productsData) {
        let product = await prisma.product.findFirst({ where: { name: p.name } });
        if (!product) {
            product = await prisma.product.create({
                data: {
                    name: p.name,
                    brand: p.brand,
                    description: p.description,
                    status: p.status,
                    imageUrl: p.imageUrl,
                    variants: {
                        create: p.variants.map(v => ({
                            ...v,
                            status: v.stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
                        }))
                    }
                },
                include: { variants: true }
            });
            createdVariants.push(...product.variants);
            console.log(`Product ${p.name} created.`);
        } else {
            // Product exists, get existing variants
            const existingVariants = await prisma.variant.findMany({ where: { productId: product.id } });
            createdVariants.push(...existingVariants);
            console.log(`Product ${p.name} already exists, skipping.`);
        }
    }

    // 3. Inventory Transactions (chỉ tạo nếu chưa có transaction nào cho variant)
    for (const variant of createdVariants) {
        const existingTx = await prisma.inventoryTx.findFirst({ where: { variantId: variant.id } });
        if (!existingTx) {
            await prisma.inventoryTx.create({
                data: {
                    variantId: variant.id,
                    type: 'RESTOCK',
                    quantity: variant.stockQuantity,
                    reason: 'Initial stock load',
                    createdBy: admin.id,
                    createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) // 31 days ago
                }
            });
        }
    }

    console.log('Inventory Transactions checked/created.');

    // 4. Create historical orders (chỉ tạo nếu chưa có order nào)
    const existingOrdersCount = await prisma.order.count();
    if (existingOrdersCount === 0) {
        const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
        const now = new Date();

        for (let i = 0; i < 60; i++) {
            const orderDate = new Date();
            orderDate.setDate(now.getDate() - Math.floor(Math.random() * 30));

            const customerObj = customers[Math.floor(Math.random() * customers.length)];
            const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];

            // Random 1-3 items per order
            const numItems = Math.floor(Math.random() * 3) + 1;
            const itemsToCreate = [];
            let totalVal = 0;

            for (let j = 0; j < numItems; j++) {
                const v = createdVariants[Math.floor(Math.random() * createdVariants.length)];
                const q = Math.floor(Math.random() * 2) + 1;
                const lineVal = Number(v.price) * q;
                totalVal += lineVal;

                itemsToCreate.push({
                    variantId: v.id,
                    variantNameSnapshot: v.name,
                    quantity: q,
                    unitPrice: v.price,
                    lineTotal: lineVal
                });
            }

            const order = await prisma.order.create({
                data: {
                    userId: customerObj.id,
                    status: orderStatus,
                    totalAmount: totalVal,
                    subtotal: totalVal,
                    shippingFee: 0,
                    paymentMethod: i % 2 === 0 ? 'COD' : 'BANK_TRANSFER',
                    shippingAddress: `${customerObj.fullName}, 0901234567, 123 Delivery St, Ward 5, District 3, Ho Chi Minh`,
                    createdAt: orderDate,
                    items: { create: itemsToCreate },
                    // Log audit for completed orders
                    ...(orderStatus === 'COMPLETED' ? {
                        completedAt: orderDate,
                        completedBy: staff.id
                    } : {}),
                    ...(orderStatus === 'CONFIRMED' ? {
                        confirmedAt: orderDate,
                        confirmedBy: staff.id
                    } : {}),
                    ...(orderStatus === 'CANCELLED' ? {
                        cancelledAt: orderDate,
                        cancelledBy: staff.id,
                        cancelReason: 'User changed mind'
                    } : {})
                }
            });

            // Add some staff notes
            if (i % 3 === 0) {
                await prisma.staffNote.create({
                    data: {
                        orderId: order.id,
                        staffId: i % 2 === 0 ? staff.id : admin.id,
                        content: `Order looks good. Customer requested urgent delivery. #${i}`,
                        createdAt: orderDate
                    }
                });
            }
        }
        console.log('Historical orders created.');
    } else {
        console.log(`Orders already exist (${existingOrdersCount} orders), skipping.`);
    }

    // 5. Carts (chỉ tạo nếu customer chưa có cart)
    for (const customerObj of customers) {
        const existingCart = await prisma.cart.findUnique({ where: { userId: customerObj.id } });
        if (!existingCart && Math.random() > 0.5) {
            const cart = await prisma.cart.create({
                data: {
                    userId: customerObj.id,
                    totalItems: 1,
                    totalAmount: 0
                }
            });

            const v = createdVariants[Math.floor(Math.random() * createdVariants.length)];
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    variantId: v.id,
                    qty: 1,
                    unitPrice: v.price,
                    lineAmount: v.price
                }
            });

            await prisma.cart.update({
                where: { id: cart.id },
                data: { totalAmount: v.price }
            });
        }
    }

    console.log('Carts checked/created.');
    console.log('✅ Production seed process completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

