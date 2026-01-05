# 📊 BÁO CÁO CẤU TRÚC CHƯƠNG TRÌNH PHONECOM

**Dự án:** PhoneCom - E-commerce quản lý cửa hàng điện thoại  
**Ngày:** 2025-01-04  
**Công nghệ:** React 19 + Node.js + Express + Prisma + PostgreSQL

---

## 🏗️ TỔNG QUAN KIẾN TRÚC

### **Kiến trúc tổng thể:**
```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React 19   │  │   Vite       │  │  TypeScript  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Context API (State Management)            │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST API
                        │ (JSON)
┌───────────────────────▼─────────────────────────────────┐
│                   BACKEND (Render)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Express    │  │  TypeScript  │  │   Prisma     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes → Controllers → Services → Database       │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma ORM
                        │
┌───────────────────────▼─────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Users, Products, Orders, Cart, Inventory, etc.   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### **Công nghệ sử dụng:**

**Frontend:**
- React 19.2.3
- Vite 6.2.0 (Build tool)
- TypeScript 5.8.2
- Tailwind CSS (CDN)
- Context API (State management)

**Backend:**
- Node.js
- Express 4.21.2
- TypeScript 5.8.2
- Prisma 5.22.0 (ORM)
- CORS 2.8.5

**Database:**
- PostgreSQL (Neon Cloud)
- 10 Models (tables)

**AI Service:**
- Google Gemini AI (Chatbot)

---

## 📁 CẤU TRÚC THƯ MỤC

### **Cấu trúc tổng thể:**
```
phonecom/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── services/          # External services (AI)
│   │   ├── db.ts              # Prisma client
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Dev seed
│   │   └── seed.prod.ts       # Production seed
│   └── package.json
│
├── components/                 # React components
│   ├── admin/                 # Admin components
│   ├── auth/                  # Authentication
│   ├── cart/                  # Shopping cart
│   ├── common/                 # Shared components
│   ├── home/                   # Home page
│   ├── layout/                 # Layout components
│   ├── orders/                # Order management
│   └── product/                # Product details
│
├── context/
│   └── AppContext.tsx         # Global state management
│
├── api.ts                     # API client (fetch wrapper)
├── App.tsx                    # Root component
├── types.ts                   # TypeScript types
└── vite.config.ts             # Vite configuration
```

---

## 🗄️ DATABASE SCHEMA

### **Tổng quan:**
- **10 Models** (tables)
- **Relationships:** One-to-Many, Many-to-One
- **Constraints:** Foreign keys, Unique constraints

### **Chi tiết Models:**

#### **1. Role (roles)**
```prisma
model Role {
  id          String   @id @default(uuid())
  name        String
  description String?
  permissions String[]
  users       User[]
}
```
**Chức năng:** Quản lý vai trò người dùng (CUSTOMER, STAFF, ADMIN, GUEST)

#### **2. User (users)**
```prisma
model User {
  id                 String        @id @default(uuid())
  roleId             String
  fullName           String
  email              String        @unique
  passwordHash       String?
  status             String        @default("ACTIVE")
  addresses          Address[]
  cart               Cart?
  orders             Order[]
  staffNotes         StaffNote[]
  // ... audit fields
}
```
**Chức năng:** Quản lý người dùng, hỗ trợ RBAC (Role-Based Access Control)

#### **3. Product (products)**
```prisma
model Product {
  id          String    @id @default(uuid())
  name        String
  brand       String
  description String?
  status      String
  imageUrl    String?
  variants    Variant[]
}
```
**Chức năng:** Quản lý sản phẩm điện thoại

#### **4. Variant (variants)**
```prisma
model Variant {
  id            String        @id @default(uuid())
  productId     String
  name          String
  color         String
  capacity      String
  price         Decimal       @db.Decimal(10, 2)
  stockQuantity Int           @default(0)
  status        String
  cartItems     CartItem[]
  orderItems    OrderItem[]
  inventoryTxs  InventoryTx[]
}
```
**Chức năng:** Quản lý biến thể sản phẩm (màu sắc, dung lượng, giá)

#### **5. Cart & CartItem (carts, cart_items)**
```prisma
model Cart {
  id          String     @id @default(uuid())
  userId      String?    @unique
  totalItems  Int        @default(0)
  totalAmount Decimal    @default(0)
  cartItems   CartItem[]
}

model CartItem {
  id         String  @id @default(uuid())
  cartId     String
  variantId  String
  qty        Int     @default(1)
  unitPrice  Decimal
  lineAmount Decimal
}
```
**Chức năng:** Quản lý giỏ hàng và items trong giỏ

#### **6. Order & OrderItem (orders, order_items)**
```prisma
model Order {
  id              String      @id @default(uuid())
  userId          String
  paymentMethod   String
  status          String      // PENDING, CONFIRMED, COMPLETED, CANCELLED
  subtotal        Decimal
  shippingFee     Decimal
  totalAmount     Decimal
  shippingAddress Json
  items           OrderItem[]
  staffNotes      StaffNote[]
  // ... audit timestamps
}

model OrderItem {
  id                  String  @id @default(uuid())
  orderId             String
  variantId           String
  variantNameSnapshot String  // Snapshot để giữ giá trị cũ
  unitPrice           Decimal
  quantity            Int
  lineTotal           Decimal
}
```
**Chức năng:** Quản lý đơn hàng với workflow (PENDING → CONFIRMED → COMPLETED)

#### **7. Address (addresses)**
```prisma
model Address {
  id            String   @id @default(uuid())
  userId        String
  recipientName String
  line1         String
  ward          String
  district      String
  province      String
  phoneNumber   String
  isDefault     Boolean  @default(false)
}
```
**Chức năng:** Quản lý địa chỉ giao hàng

#### **8. StaffNote (staff_notes)**
```prisma
model StaffNote {
  id        String   @id @default(uuid())
  orderId   String
  staffId   String
  content   String
  createdAt DateTime @default(now())
}
```
**Chức năng:** Ghi chú nội bộ của staff cho đơn hàng

#### **9. InventoryTx (inventory_transactions)**
```prisma
model InventoryTx {
  id        String   @id @default(uuid())
  variantId String
  type      String   // RESTOCK, SALE, ADJUSTMENT
  quantity  Int
  reason    String
  createdBy String
  createdAt DateTime @default(now())
}
```
**Chức năng:** Lịch sử thay đổi tồn kho (audit trail)

---

## 🔧 BACKEND ARCHITECTURE

### **Cấu trúc Backend:**

```
backend/src/
├── index.ts              # Server entry, middleware, routes setup
├── db.ts                 # Prisma client singleton
│
├── routes/                # API Routes (RESTful)
│   ├── users.ts
│   ├── products.ts
│   ├── variants.ts
│   ├── cart.ts
│   ├── orders.ts
│   ├── addresses.ts
│   ├── staffNotes.ts
│   ├── inventory.ts
│   └── chat.ts
│
├── controllers/          # Business Logic
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── variant.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   ├── address.controller.ts
│   ├── staffNote.controller.ts
│   ├── inventory.controller.ts
│   └── chat.controller.ts
│
└── services/             # External Services
    └── ai.ts             # Google Gemini AI integration
```

### **1. Server Entry Point (`index.ts`)**

**Chức năng:**
- Khởi tạo Express server
- Cấu hình middleware (CORS, JSON parser)
- Đăng ký routes
- Error handling
- Health check endpoint

**Các hàm chính:**
```typescript
// Middleware
app.use(cors({ ... }))      // CORS configuration
app.use(express.json())     // JSON parser

// Routes
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
// ... 9 routes total

// Health check
app.get('/health', (req, res) => { ... })
```

### **2. Routes (RESTful API)**

**Pattern:** `routes/[resource].ts`

**Ví dụ: `routes/products.ts`**
```typescript
router.post('/', productController.createProduct)      // POST /api/products
router.get('/', productController.getAllProducts)      // GET /api/products
router.get('/:id', productController.getProductById)  // GET /api/products/:id
router.put('/:id', productController.updateProduct)  // PUT /api/products/:id
router.delete('/:id', productController.deleteProduct) // DELETE /api/products/:id
```

**Tất cả Routes:**
- `/api/users` - User management
- `/api/products` - Product CRUD
- `/api/variants` - Variant management
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order management
- `/api/addresses` - Address management
- `/api/staff-notes` - Staff notes CRUD
- `/api/inventory` - Inventory transactions
- `/api/chat` - AI chatbot

### **3. Controllers (Business Logic)**

**Pattern:** `controllers/[resource].controller.ts`

**Ví dụ: `controllers/product.controller.ts`**

**Các hàm:**
```typescript
// Tạo sản phẩm mới
createProduct(req, res) {
  - Validate input
  - Create product với variants (nested create)
  - Return product với variants
}

// Lấy tất cả sản phẩm
getAllProducts(req, res) {
  - Query products với variants
  - Order by createdAt desc
  - Return array
}

// Lấy sản phẩm theo ID
getProductById(req, res) {
  - Find unique product
  - Include variants
  - Return 404 nếu không tìm thấy
}

// Cập nhật sản phẩm
updateProduct(req, res) {
  - Update product fields
  - Return updated product
}

// Xóa sản phẩm
deleteProduct(req, res) {
  - Delete product (cascade variants)
  - Return 204
}
```

**Tất cả Controllers:**
- `user.controller.ts` - User CRUD, role management
- `product.controller.ts` - Product CRUD
- `variant.controller.ts` - Variant update, stock management
- `cart.controller.ts` - Add/update/remove cart items
- `order.controller.ts` - Create order, update status, workflow
- `address.controller.ts` - Address CRUD
- `staffNote.controller.ts` - Staff notes CRUD
- `inventory.controller.ts` - Inventory transactions history
- `chat.controller.ts` - AI chatbot integration

### **4. Services**

**File: `services/ai.ts`**

**Chức năng:** Tích hợp Google Gemini AI cho chatbot

**Hàm chính:**
```typescript
getChatResponse(userMessage, history) {
  1. Fetch products từ database
  2. Format product context
  3. Initialize Gemini model với system instruction
  4. Send message với history
  5. Return AI response
}
```

### **5. Database Client (`db.ts`)**

**Chức năng:**
- Prisma Client singleton
- Connection test khi start
- Logging configuration

**Code:**
```typescript
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((error) => console.error('❌ Database connection failed:', error));
```

---

## 🎨 FRONTEND ARCHITECTURE

### **Cấu trúc Frontend:**

```
frontend/
├── App.tsx                    # Root component
├── index.tsx                  # Entry point
├── api.ts                     # API client (fetch wrapper)
├── types.ts                   # TypeScript interfaces
│
├── context/
│   └── AppContext.tsx         # Global state management
│
└── components/
    ├── layout/                # Layout components
    │   ├── Header.tsx
    │   ├── MainContent.tsx
    │   └── ToastContainer.tsx
    │
    ├── home/                  # Home page
    │   ├── HeroSection.tsx
    │   └── ProductList.tsx
    │
    ├── product/               # Product details
    │   └── ProductDetail.tsx
    │
    ├── cart/                  # Shopping cart
    │   ├── CartView.tsx
    │   └── CheckoutView.tsx
    │
    ├── orders/                # Order management
    │   └── OrderHistory.tsx
    │
    ├── auth/                  # Authentication
    │   ├── LoginView.tsx
    │   └── RegisterView.tsx
    │
    ├── admin/                 # Admin dashboard
    │   └── StaffDashboard.tsx
    │
    └── common/                # Shared components
        └── ChatBot.tsx        # AI Chatbot
```

### **1. State Management (`context/AppContext.tsx`)**

**Chức năng:** Quản lý global state cho toàn bộ ứng dụng

**State:**
```typescript
interface AppState {
  currentUser: User | null;      // User hiện tại
  allUsers: User[];              // Tất cả users (admin)
  products: Product[];            // Danh sách sản phẩm
  cart: CartItem[];              // Giỏ hàng
  orders: Order[];                // Đơn hàng
  view: string;                   // View hiện tại
  currentProduct: Product | null;  // Sản phẩm đang xem
  notifications: Notification[];   // Toast notifications
}
```

**Các hàm chính:**
```typescript
// Authentication
login(email, role)              // Đăng nhập
register(fullName, email, password) // Đăng ký
logout()                         // Đăng xuất

// Cart Management
addToCart(variant, product)      // Thêm vào giỏ
removeFromCart(itemId)           // Xóa khỏi giỏ
updateCartQty(itemId, delta)    // Cập nhật số lượng

// Order Management
placeOrder(shippingAddress)      // Đặt hàng
updateOrderStatus(orderId, status, note) // Cập nhật trạng thái

// Product Management
updateProduct(productId, data)  // Cập nhật sản phẩm
addProduct(productData)          // Thêm sản phẩm
deleteProduct(productId)         // Xóa sản phẩm
updateVariant(variantId, data)   // Cập nhật variant

// Inventory Management
updateInventory(variantId, newStock) // Cập nhật tồn kho

// Staff Notes
addStaffNote(orderId, content)   // Thêm ghi chú
editStaffNote(noteId, content)   // Sửa ghi chú
deleteStaffNote(noteId)          // Xóa ghi chú

// UI
setView(view)                    // Chuyển view
setCurrentProduct(product)       // Set sản phẩm hiện tại
showNotification(message, type)   // Hiển thị thông báo
```

### **2. API Client (`api.ts`)**

**Chức năng:** Wrapper cho fetch API, xử lý errors

**Cấu trúc:**
```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = {
  users: {
    create, getAll, getById, getCart, getOrders, getAddresses, update
  },
  products: {
    getAll, getById, create, update, delete
  },
  variants: {
    update
  },
  cart: {
    add, updateQty, remove, clearParams
  },
  orders: {
    create, getAll, updateStatus
  },
  addresses: {
    create
  },
  staffNotes: {
    create, update, delete
  },
  inventory: {
    getTransactions
  },
  chat: {
    sendMessage
  }
};
```

**Helper function:**
```typescript
handleResponse<T>(response) {
  - Check response.ok
  - Parse JSON
  - Throw error nếu có lỗi
  - Return typed data
}
```

### **3. Components**

#### **Layout Components:**

**`Header.tsx`**
- Navigation bar
- User menu (login/logout)
- Cart icon với badge
- Role-based menu items

**`MainContent.tsx`**
- Router logic (view switching)
- Render components dựa trên `view` state

**`ToastContainer.tsx`**
- Hiển thị notifications
- Auto-dismiss sau 3 giây

#### **Home Components:**

**`HeroSection.tsx`**
- Hero banner
- Call-to-action buttons

**`ProductList.tsx`**
- Grid layout sản phẩm
- Product cards với image, name, price
- Click để xem chi tiết

#### **Product Components:**

**`ProductDetail.tsx`**
- Product information
- Variant selector (color, capacity)
- Add to cart button
- Stock status

#### **Cart Components:**

**`CartView.tsx`**
- Danh sách items trong giỏ
- Update quantity
- Remove items
- Total calculation
- Checkout button

**`CheckoutView.tsx`**
- Address selection/input
- Order summary
- Payment method selection
- Place order button

#### **Order Components:**

**`OrderHistory.tsx`**
- Danh sách đơn hàng của user
- Order status badges
- Order details modal

#### **Auth Components:**

**`LoginView.tsx`**
- Email input
- Role selection (demo)
- Login button

**`RegisterView.tsx`**
- Full name, email, password inputs
- Register button

#### **Admin Components:**

**`StaffDashboard.tsx`**
- Order management table
- Status update buttons
- Staff notes editor
- Inventory management
- Product management
- User management
- Statistics charts

#### **Common Components:**

**`ChatBot.tsx`**
- AI chatbot interface
- Message history
- Send message input
- Integration với Gemini AI

---

## 🔄 WORKFLOWS VÀ BUSINESS LOGIC

### **1. Order Workflow**

```
PENDING → CONFIRMED → COMPLETED
   ↓
CANCELLED
```

**States:**
- **PENDING:** Đơn hàng mới tạo, chưa xử lý
- **CONFIRMED:** Staff đã xác nhận, trừ tồn kho
- **COMPLETED:** Đã giao hàng thành công
- **CANCELLED:** Đã hủy (bởi user hoặc staff)

**Functions:**
```typescript
// Tạo đơn hàng
placeOrder(shippingAddress) {
  1. Validate cart không rỗng
  2. Check stock availability
  3. Create order với items
  4. Clear cart
  5. Show success notification
}

// Cập nhật trạng thái (Staff)
updateOrderStatus(orderId, status) {
  1. Update order status
  2. Nếu CONFIRMED: Trừ tồn kho
  3. Tạo inventory transaction
  4. Update timestamps (confirmedAt, completedAt, etc.)
}
```

### **2. Inventory Workflow**

**Transaction Types:**
- **RESTOCK:** Nhập hàng
- **SALE:** Bán hàng (khi confirm order)
- **ADJUSTMENT:** Điều chỉnh

**Functions:**
```typescript
// Cập nhật tồn kho
updateInventory(variantId, newStock) {
  1. Calculate quantity change
  2. Update variant.stockQuantity
  3. Create InventoryTx record
  4. Update variant status (IN_STOCK/OUT_OF_STOCK)
}
```

### **3. Cart Workflow**

**Functions:**
```typescript
// Thêm vào giỏ
addToCart(variant, product) {
  1. Check nếu variant đã có trong giỏ
  2. Nếu có: Tăng quantity
  3. Nếu không: Thêm item mới
  4. Update cart totals
  5. Sync với backend
}

// Cập nhật số lượng
updateCartQty(itemId, delta) {
  1. Find cart item
  2. Update quantity
  3. Validate stock availability
  4. Update line amount
  5. Update cart totals
}
```

### **4. RBAC (Role-Based Access Control)**

**Roles:**
- **GUEST:** Chỉ xem sản phẩm
- **CUSTOMER:** Mua hàng, xem đơn hàng
- **STAFF:** Quản lý đơn hàng, tồn kho
- **ADMIN:** Toàn quyền

**Permission Check:**
```typescript
// Frontend
if (currentUser?.role.name === 'ADMIN' || currentUser?.role.name === 'STAFF') {
  // Show admin features
}

// Backend (có thể thêm middleware)
// Hiện tại chưa có authentication middleware
// Có thể thêm JWT authentication sau
```

---

## 📡 API ENDPOINTS

### **Users API:**
- `GET /api/users` - Lấy tất cả users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `GET /api/users/:id/cart` - Lấy giỏ hàng của user
- `GET /api/users/:id/orders` - Lấy đơn hàng của user
- `GET /api/users/:id/addresses` - Lấy địa chỉ của user

### **Products API:**
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `POST /api/products/:productId/variants` - Thêm variant

### **Variants API:**
- `PUT /api/variants/:id` - Cập nhật variant (giá, tồn kho)

### **Cart API:**
- `POST /api/cart` - Thêm vào giỏ
- `PUT /api/cart/:id` - Cập nhật số lượng
- `DELETE /api/cart/:id` - Xóa khỏi giỏ
- `DELETE /api/cart/user/:userId` - Xóa toàn bộ giỏ

### **Orders API:**
- `GET /api/orders` - Lấy tất cả đơn hàng (có thể filter by status)
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### **Addresses API:**
- `POST /api/addresses` - Tạo địa chỉ mới

### **Staff Notes API:**
- `POST /api/staff-notes` - Tạo ghi chú
- `PUT /api/staff-notes/:id` - Cập nhật ghi chú
- `DELETE /api/staff-notes/:id` - Xóa ghi chú

### **Inventory API:**
- `GET /api/inventory/transactions` - Lấy lịch sử giao dịch tồn kho

### **Chat API:**
- `POST /api/chat` - Gửi message đến AI chatbot

### **Health Check:**
- `GET /health` - Health check endpoint
- `GET /` - Root endpoint

---

## 🎯 CÁC TÍNH NĂNG CHÍNH

### **1. Customer Features:**
- ✅ Duyệt sản phẩm (danh sách, chi tiết)
- ✅ Thêm vào giỏ hàng
- ✅ Quản lý giỏ hàng (update quantity, remove)
- ✅ Checkout (chọn địa chỉ, đặt hàng)
- ✅ Xem lịch sử đơn hàng
- ✅ AI Chatbot (tư vấn sản phẩm)

### **2. Staff Features:**
- ✅ Dashboard quản lý đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Quản lý tồn kho
- ✅ Thêm/sửa ghi chú cho đơn hàng
- ✅ Xem thống kê (charts)

### **3. Admin Features:**
- ✅ Tất cả tính năng của Staff
- ✅ Quản lý users (CRUD)
- ✅ Thay đổi role của user
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý variants (update price, stock)

---

## 🔐 SECURITY & BEST PRACTICES

### **Đã implement:**
- ✅ CORS configuration
- ✅ Input validation (Prisma)
- ✅ Error handling middleware
- ✅ TypeScript type safety
- ✅ Environment variables

### **Có thể cải thiện:**
- ⚠️ JWT Authentication (hiện tại chưa có)
- ⚠️ Password hashing (hiện tại chưa có)
- ⚠️ Rate limiting
- ⚠️ Input sanitization
- ⚠️ SQL injection protection (Prisma đã handle)

---

## 📊 STATISTICS

### **Code Statistics:**
- **Backend Routes:** 9 routes
- **Backend Controllers:** 9 controllers
- **Frontend Components:** 15+ components
- **Database Models:** 10 models
- **API Endpoints:** 30+ endpoints
- **TypeScript Files:** 25+ files

### **Features:**
- **User Roles:** 4 roles (GUEST, CUSTOMER, STAFF, ADMIN)
- **Order Statuses:** 4 statuses (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- **Inventory Transaction Types:** 3 types (RESTOCK, SALE, ADJUSTMENT)

---

## 🎉 KẾT LUẬN

Dự án PhoneCom được xây dựng với:
- ✅ **Kiến trúc rõ ràng:** Separation of concerns (Routes → Controllers → Database)
- ✅ **Type Safety:** TypeScript toàn bộ codebase
- ✅ **Scalable:** Dễ mở rộng thêm features
- ✅ **Maintainable:** Code structure dễ đọc, dễ maintain
- ✅ **Modern Stack:** React 19, Node.js, Prisma, PostgreSQL

**Điểm mạnh:**
- Clean architecture
- RESTful API design
- Context API cho state management
- Prisma ORM cho type-safe database access
- AI integration (Gemini)

**Có thể cải thiện:**
- Authentication & Authorization (JWT)
- Password hashing
- API rate limiting
- Unit tests & Integration tests
- Error logging service

---

**Báo cáo được tạo bởi:** AI Assistant  
**Ngày:** 2025-01-04

