# 📱 PhoneCom - Mô Tả Dự Án E-commerce MVP

## 🎯 Tổng Quan Dự Án

**PhoneCom** là một hệ thống quản lý cửa hàng điện thoại (E-commerce MVP) được xây dựng với kiến trúc Full-stack hiện đại, tích hợp **Trợ lý AI thông minh** sử dụng Google Gemini để nâng cao trải nghiệm mua sắm. Dự án cung cấp đầy đủ tính năng từ phía khách hàng (duyệt sản phẩm, giỏ hàng, đặt hàng) đến phía quản lý (dashboard, tồn kho, đơn hàng, nhân viên).

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 19** - UI framework hiện đại
- **Vite** - Build tool nhanh chóng
- **TypeScript** - Type safety
- **Tailwind CSS** (via CDN) - Styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization (charts, graphs)

### Backend
- **Node.js** với **Express** - RESTful API server
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database
- **Google Generative AI (Gemini 2.5 Flash)** - AI Chatbot service

### Kiến Trúc
- **MVC Pattern** - Tách biệt logic, routes, và controllers
- **RESTful API** - Standard API design
- **Context API** - State management (React)
- **Modular Components** - Code organization

---

## ✨ Tính Năng Chính

### 👤 Phía Khách Hàng (Customer)

#### 1. **Duyệt & Tìm Kiếm Sản Phẩm**
- Xem danh sách sản phẩm điện thoại với đầy đủ thông tin
- Xem chi tiết sản phẩm: tên, thương hiệu, mô tả, hình ảnh
- Xem các biến thể (variants): màu sắc, dung lượng, giá, tồn kho
- Lọc và tìm kiếm sản phẩm

#### 2. **Giỏ Hàng (Shopping Cart)**
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Xem tổng tiền và số lượng items
- Giỏ hàng được lưu theo user (persistent)

#### 3. **Đặt Hàng (Checkout)**
- Quản lý địa chỉ giao hàng (thêm, sửa, xóa)
- Chọn địa chỉ mặc định
- Xem tóm tắt đơn hàng
- Thanh toán COD (Cash on Delivery)
- Đặt hàng và nhận xác nhận

#### 4. **Lịch Sử Đơn Hàng**
- Xem tất cả đơn hàng đã đặt
- Theo dõi trạng thái đơn hàng: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Xem chi tiết từng đơn hàng: sản phẩm, giá, địa chỉ giao hàng

#### 5. **Trợ Lý AI Chatbot** 🤖
- Chat trực tiếp với AI Assistant
- Tư vấn sản phẩm dựa trên dữ liệu thực tế của cửa hàng
- So sánh các sản phẩm
- Trả lời thắc mắc về cửa hàng
- Gợi ý sản phẩm phù hợp
- Tích hợp Google Gemini 2.5 Flash

### 👨‍💼 Phía Nhân Viên (Staff)

#### 1. **Dashboard Quản Lý**
- **Overview Tab**: 
  - Thống kê tổng quan: doanh thu, số đơn hàng, sản phẩm
  - Biểu đồ doanh thu theo thời gian (Line Chart)
  - Biểu đồ phân bố trạng thái đơn hàng (Pie Chart)
  - Biểu đồ sản phẩm bán chạy (Bar Chart)

#### 2. **Quản Lý Đơn Hàng**
- Xem tất cả đơn hàng từ khách hàng
- Lọc đơn hàng theo trạng thái
- Cập nhật trạng thái đơn hàng:
  - **PENDING** → **CONFIRMED**: Xác nhận đơn, trừ tồn kho
  - **CONFIRMED** → **COMPLETED**: Hoàn thành giao hàng
  - Hủy đơn hàng với lý do
- Thêm ghi chú nội bộ cho đơn hàng (Staff Notes)
- Xem chi tiết đơn hàng: khách hàng, sản phẩm, địa chỉ

#### 3. **Quản Lý Tồn Kho (Inventory)**
- Xem tổng quan tồn kho tất cả sản phẩm
- Cập nhật số lượng tồn kho
- Xem lịch sử giao dịch tồn kho (Inventory Transactions)
- Ghi nhận nhập/xuất kho với lý do
- Cảnh báo sản phẩm sắp hết hàng

#### 4. **Quản Lý Sản Phẩm**
- Xem danh sách sản phẩm
- Thêm sản phẩm mới với variants
- Sửa thông tin sản phẩm: tên, thương hiệu, mô tả, hình ảnh
- Xóa sản phẩm
- Quản lý variants: màu, dung lượng, giá, tồn kho

### 👑 Phía Quản Trị (Admin)

#### 1. **Tất Cả Tính Năng của Staff**
- Admin có quyền truy cập tất cả tính năng của Staff

#### 2. **Quản Lý Người Dùng**
- Xem danh sách tất cả users
- Cập nhật vai trò (Role) của user: CUSTOMER, STAFF, ADMIN
- Quản lý trạng thái user: ACTIVE, INACTIVE

#### 3. **Dashboard Nâng Cao**
- Thống kê chi tiết hơn
- Phân tích doanh thu theo user
- Quản lý toàn bộ hệ thống

---

## 🗄️ Cấu Trúc Database

### Models Chính

1. **User (Người dùng)**
   - Thông tin: id, fullName, email, roleId, status
   - Quan hệ: addresses, cart, orders, staffNotes

2. **Role (Vai trò)**
   - Các role: GUEST, CUSTOMER, STAFF, ADMIN
   - Permissions: danh sách quyền

3. **Product (Sản phẩm)**
   - Thông tin: name, brand, description, imageUrl, status
   - Quan hệ: variants

4. **Variant (Biến thể sản phẩm)**
   - Thông tin: name, color, capacity, price, stockQuantity, imageUrl
   - Quan hệ: product, cartItems, orderItems, inventoryTxs

5. **Cart & CartItem (Giỏ hàng)**
   - Lưu trữ giỏ hàng của user
   - Tính toán totalItems, totalAmount

6. **Order & OrderItem (Đơn hàng)**
   - Trạng thái: PENDING, CONFIRMED, COMPLETED, CANCELLED
   - Lưu snapshot địa chỉ giao hàng
   - Tracking: createdBy, confirmedBy, completedBy, cancelledBy
   - Timestamps: createdAt, confirmedAt, completedAt, cancelledAt

7. **Address (Địa chỉ)**
   - Thông tin đầy đủ: recipientName, line1, ward, district, province, phoneNumber
   - Địa chỉ mặc định (isDefault)

8. **StaffNote (Ghi chú nội bộ)**
   - Ghi chú của staff cho đơn hàng
   - Tracking: author, createdAt

9. **InventoryTx (Giao dịch tồn kho)**
   - Lịch sử nhập/xuất kho
   - Type: IMPORT, EXPORT
   - Tracking: createdBy, reason, quantity

---

## 🔌 API Endpoints

### Users (`/api/users`)
- `POST /` - Tạo user mới
- `GET /` - Lấy tất cả users (Admin)
- `GET /:id` - Lấy user theo ID
- `PUT /:id` - Cập nhật user
- `DELETE /:id` - Xóa user
- `GET /:userId/cart` - Lấy giỏ hàng của user
- `GET /:userId/orders` - Lấy đơn hàng của user
- `GET /:userId/addresses` - Lấy địa chỉ của user

### Products (`/api/products`)
- `POST /` - Tạo sản phẩm mới
- `GET /` - Lấy tất cả sản phẩm
- `GET /:id` - Lấy sản phẩm theo ID
- `PUT /:id` - Cập nhật sản phẩm
- `DELETE /:id` - Xóa sản phẩm
- `POST /:id/variants` - Thêm variant cho sản phẩm

### Variants (`/api/variants`)
- `GET /:id` - Lấy variant theo ID
- `PUT /:id` - Cập nhật variant
- `DELETE /:id` - Xóa variant
- `GET /:id/inventory` - Lấy thông tin tồn kho

### Cart (`/api/cart`)
- `POST /` - Thêm vào giỏ hàng
- `PUT /:id` - Cập nhật số lượng
- `DELETE /:id` - Xóa khỏi giỏ hàng
- `DELETE /user/:userId` - Xóa toàn bộ giỏ hàng

### Orders (`/api/orders`)
- `POST /` - Tạo đơn hàng mới
- `GET /` - Lấy tất cả đơn hàng (Staff/Admin)
- `GET /:id` - Lấy đơn hàng theo ID
- `PUT /:id/status` - Cập nhật trạng thái đơn hàng

### Addresses (`/api/addresses`)
- `POST /` - Tạo địa chỉ mới
- `GET /:id` - Lấy địa chỉ theo ID
- `PUT /:id` - Cập nhật địa chỉ
- `DELETE /:id` - Xóa địa chỉ
- `PUT /:id/default` - Đặt làm địa chỉ mặc định

### Staff Notes (`/api/staff-notes`)
- `POST /` - Thêm ghi chú
- `GET /order/:orderId` - Lấy ghi chú của đơn hàng
- `PUT /:id` - Cập nhật ghi chú
- `DELETE /:id` - Xóa ghi chú

### Inventory (`/api/inventory`)
- `POST /transactions` - Ghi nhận giao dịch tồn kho
- `GET /transactions` - Lấy lịch sử giao dịch
- `GET /summary` - Tổng quan tồn kho

### Chat (`/api/chat`)
- `POST /` - Gửi tin nhắn đến AI Assistant

---

## 🎨 Giao Diện & UX

### Components Chính

1. **Layout Components**
   - `Header` - Navigation bar với menu theo role
   - `MainContent` - Router chính
   - `ToastContainer` - Thông báo

2. **Home Components**
   - `HeroSection` - Banner trang chủ
   - `ProductList` - Danh sách sản phẩm

3. **Product Components**
   - `ProductDetail` - Chi tiết sản phẩm

4. **Cart Components**
   - `CartView` - Xem giỏ hàng
   - `CheckoutView` - Thanh toán

5. **Order Components**
   - `OrderHistory` - Lịch sử đơn hàng

6. **Admin Components**
   - `StaffDashboard` - Dashboard quản lý với nhiều tabs

7. **Auth Components**
   - `LoginView` - Đăng nhập
   - `RegisterView` - Đăng ký

8. **Common Components**
   - `ChatBot` - AI Chatbot widget

### Design Features
- **Responsive Design** - Tương thích mobile và desktop
- **Modern UI** - Giao diện hiện đại với Tailwind CSS
- **Real-time Updates** - Cập nhật dữ liệu realtime
- **Toast Notifications** - Thông báo rõ ràng
- **Loading States** - Trạng thái loading
- **Error Handling** - Xử lý lỗi thân thiện

---

## 🔐 Phân Quyền & Bảo Mật

### Role-Based Access Control (RBAC)

1. **GUEST** - Khách vãng lai
   - Chỉ xem sản phẩm

2. **CUSTOMER** - Khách hàng
   - Xem sản phẩm
   - Quản lý giỏ hàng
   - Đặt hàng
   - Xem lịch sử đơn hàng của mình
   - Quản lý địa chỉ
   - Sử dụng AI Chatbot

3. **STAFF** - Nhân viên
   - Tất cả quyền của CUSTOMER
   - Quản lý đơn hàng
   - Quản lý tồn kho
   - Quản lý sản phẩm
   - Xem dashboard
   - Thêm ghi chú nội bộ

4. **ADMIN** - Quản trị viên
   - Tất cả quyền của STAFF
   - Quản lý users
   - Thay đổi role của users
   - Xem toàn bộ thống kê

---

## 📊 Tính Năng Đặc Biệt

### 1. **AI Shopping Assistant**
- Tích hợp Google Gemini 2.5 Flash
- Context-aware: Hiểu sản phẩm trong cửa hàng
- So sánh sản phẩm thông minh
- Tư vấn dựa trên dữ liệu thực tế
- Giao tiếp bằng tiếng Việt

### 2. **Inventory Management**
- Tự động trừ tồn kho khi đơn hàng được xác nhận
- Lịch sử giao dịch chi tiết
- Cảnh báo tồn kho thấp
- Nhập/xuất kho với lý do

### 3. **Order Workflow**
- Quy trình đơn hàng rõ ràng: PENDING → CONFIRMED → COMPLETED
- Tracking đầy đủ: ai làm gì, khi nào
- Staff notes cho giao tiếp nội bộ
- Hủy đơn với lý do

### 4. **Dashboard Analytics**
- Biểu đồ doanh thu theo thời gian
- Phân tích trạng thái đơn hàng
- Top sản phẩm bán chạy
- Thống kê tổng quan

### 5. **Product Variants**
- Quản lý nhiều biến thể cho 1 sản phẩm
- Màu sắc, dung lượng, giá khác nhau
- Tồn kho riêng cho từng variant

---

## 🚀 Khả Năng Mở Rộng

Dự án được thiết kế với kiến trúc mở rộng tốt:

- **Modular Architecture** - Dễ thêm tính năng mới
- **RESTful API** - Dễ tích hợp với mobile app
- **TypeScript** - Type safety, dễ maintain
- **Prisma ORM** - Dễ migrate database
- **Component-based** - Tái sử dụng code

### Có thể mở rộng thêm:
- Payment Gateway (Stripe, PayPal)
- Email notifications
- SMS notifications
- Product reviews & ratings
- Wishlist
- Coupon/Discount system
- Multi-language support
- Advanced search & filters
- Product recommendations
- Export reports (PDF, Excel)

---

## 📈 Trạng Thái Dự Án

✅ **Hoàn thành:**
- Core e-commerce features
- User authentication & authorization
- Product management
- Shopping cart & checkout
- Order management
- Inventory management
- AI Chatbot integration
- Admin/Staff dashboard
- Responsive UI

🔄 **Đang phát triển:**
- Testing & bug fixes
- Performance optimization
- Documentation

---

## 📝 Kết Luận

PhoneCom là một **E-commerce MVP hoàn chỉnh** với đầy đủ tính năng cần thiết cho việc vận hành một cửa hàng điện thoại. Dự án tích hợp công nghệ AI hiện đại để nâng cao trải nghiệm khách hàng, đồng thời cung cấp công cụ quản lý mạnh mẽ cho nhân viên và quản trị viên.

**Điểm mạnh:**
- ✅ Full-stack TypeScript
- ✅ AI-powered shopping assistant
- ✅ Comprehensive admin dashboard
- ✅ Modern UI/UX
- ✅ Scalable architecture
- ✅ Role-based access control

**Phù hợp cho:**
- Cửa hàng điện thoại nhỏ và vừa
- MVP để test thị trường
- Học tập và phát triển kỹ năng Full-stack
- Base để mở rộng thành platform lớn hơn

