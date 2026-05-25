# Book Manager API

Backend cho mobile app quản lý sách với MongoDB, JWT và role-based authorization.

## Setup

1. Cài dependencies:
   ```bash
   npm install
   ```
2. Tạo file `.env` với nội dung:
   ```env
   PORT=9999
  HOST=0.0.0.0
   MONGO_URI="mongodb://127.0.0.1:27017/shopdb"
   JWT_SECRET=your_secret_key
   ```
3. Run seed data mẫu:
   ```bash
   npm run seed
   ```
4. Start server:
   ```bash
   npm run dev
   ```

## Sample accounts

- Admin:
  - email: `admin@example.com`
  - password: `Admin123!`

- User 1:
  - email: `user1@example.com`
  - password: `User123!`

- User 2:
  - email: `user2@example.com`
  - password: `User123!`

Mỗi tài khoản mẫu trong seed bây giờ cũng có sẵn `avatar` để test nhanh giao diện profile và API upload ảnh.

## Postman test

### 1. Login

Request:
- Method: `POST`
- URL: `http://localhost:9999/api/users/login`
- Body (JSON):
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin123!"
  }
  ```

Response:
- `token`: dùng cho header Authorization.

### 2. Authorization header

Thêm header cho request:

- Key: `Authorization`
- Value: `Bearer <token>`

### 3. User routes

- `GET /api/users/profile`
  - Xem thông tin user hiện tại.
- `GET /api/users`
  - Chỉ admin xem được danh sách user.
- `GET /api/users/:id`
  - User chỉ xem được chính mình.
  - Admin xem được mọi user.
- `PUT /api/users/:id`
  - User chỉ sửa được chính mình.
  - Admin sửa được mọi user và có thể cập nhật `role`.
- `DELETE /api/users/:id`
  - Chỉ admin mới xóa user.

### 4. Book routes

- `GET /api/books`
  - User và admin đều xem được.
- `POST /api/books`
  - User hoặc admin tạo sách.
- `GET /api/books/:id`
  - Xem chi tiết sách kèm rating và review.
- `PUT /api/books/:id`
  - Chỉ admin sửa sách.
- `DELETE /api/books/:id`
  - Chỉ admin xóa sách.
- `GET /api/books/suggestions?genre=Fantasy`
  - Đề xuất sách theo thể loại.

### 5. Review routes

- `GET /api/reviews`
  - Admin xem tất cả review.
  - User chỉ xem review của chính mình.
- `POST /api/reviews`
  - User tạo review cho sách.
- `GET /api/reviews/:id`
  - Admin xem mọi review.
  - User chỉ xem review của mình.
- `PUT /api/reviews/:id`
  - Admin sửa mọi review.
  - User sửa review của mình.
- `DELETE /api/reviews/:id`
  - Admin xóa mọi review.
  - User xóa review của mình.

### 6. Sample requests

#### Create new book (user hoặc admin)

- Method: `POST`
- URL: `http://localhost:9999/api/books`
- Body:
  ```json
  {
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description",
    "genre": "Fantasy"
  }
  ```

#### Create new review

- Method: `POST`
- URL: `http://localhost:9999/api/reviews`
- Body:
  ```json
  {
    "bookId": "<bookId>",
    "rating": 5,
    "comment": "Really good book"
  }
  ```

### 7. Notes

- Mặc định user mới tạo bằng `POST /api/users` sẽ có role `user`.
- Nếu muốn admin tạo thêm admin, sửa trực tiếp trường `role` trong database hoặc dùng endpoint `PUT /api/users/:id` khi đăng nhập bằng tài khoản admin.

## Giao diện (UI) - demo

Mình đã thêm một UI tĩnh nhỏ vào `src/ui` để demo việc đăng nhập và xem danh sách sách.

- Chạy server (như phần trên):
  ```bash
  npm install
  npm run dev
  ```
- Mở trình duyệt và truy cập: `http://localhost:9999/` để vào giao diện.
- Luồng dùng:
  - Vào **Đăng nhập** và sử dụng tài khoản mẫu (ví dụ `admin@example.com` / `Admin123!`).
  - Sau khi đăng nhập thành công, UI sẽ lưu `token` vào `localStorage` và chuyển sang trang **Danh sách sách**.
  - Trang **Danh sách sách** sẽ gọi API `GET /api/books` kèm header `Authorization: Bearer <token>` để lấy dữ liệu.

## Kết nối từ Android Studio

Nếu app Android chạy trên emulator hoặc điện thoại thật, hãy dùng đúng URL backend sau:

- Android emulator: `http://10.0.2.2:9999/api/`
- Điện thoại thật trong cùng mạng LAN: `http://192.168.15.89:9999/api/`

Lưu ý: URL phải là `http://192.168.15.89:9999/` chứ không phải `http://l192.168.15.89:9999/` vì ký tự `l` ở đầu sẽ làm sai địa chỉ.

## Push Notification FCM

Backend đã thêm hỗ trợ FCM để app Android có thể lưu token của máy và admin bắn notification.

- Lưu token cho user đang đăng nhập: `POST /api/users/me/fcm-token`
  - Body JSON:
    ```json
    { "token": "<FCM_DEVICE_TOKEN>" }
    ```
- Broadcast từ admin: `POST /api/admin/broadcast`
  - Body JSON:
    ```json
    {
      "title": "Thong bao moi",
      "body": "Ban co mot thong bao moi",
      "data": { "screen": "book_detail", "bookId": "123" }
    }
    ```

Server cần cấu hình Firebase Admin bằng một trong 2 biến môi trường sau:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: nội dung JSON service account của Firebase
- `FIREBASE_SERVICE_ACCOUNT_PATH`: đường dẫn tới file service account JSON

Nếu chưa cấu hình Firebase, endpoint broadcast sẽ trả lỗi rõ ràng để bạn biết cần bổ sung credentials.

## Postman

Mình đã thêm sẵn file để import vào Postman trong thư mục [postman](postman):

- [BookManager.postman_collection.json](postman/BookManager.postman_collection.json)
- [BookManager.postman_environment.json](postman/BookManager.postman_environment.json)

Import cả 2 file vào Postman, chọn environment `Book Manager Local`, rồi chạy `Login` trước để tự lưu `token`.

Ghi chú: UI này là tĩnh (vanilla HTML/CSS/JS) để demo — nếu API yêu cầu token hợp lệ thì hãy đảm bảo đã seed data và dùng tài khoản thực tế.

## Thành phần (Chức năng)

Dưới đây là mô tả ngắn về các thành phần chính trong project và trách nhiệm của chúng:

- `src/models/Book.js`: định nghĩa schema sách (title, author, description, genre, ratings, reviews, createdAt, ...). Chịu trách nhiệm về cấu trúc dữ liệu sách, quan hệ tới `Review` và các helper/statics liên quan (ví dụ tính điểm trung bình).
- `src/models/Review.js`: định nghĩa schema review (book, user, rating, comment, createdAt). Đảm bảo ràng buộc quan hệ giữa review và sách/người dùng, và các validation cần thiết.
- `src/models/User.js`: định nghĩa schema người dùng (name, email, password, role, createdAt). Chịu hashing password, phương thức `comparePassword`, và quản lý role (`user` / `admin`).

- `src/controllers/bookController.js`: xử lý logic liên quan đến sách: lấy danh sách, lấy chi tiết, tạo/sửa/xóa sách, trả về gợi ý theo thể loại và lấy review của sách. Thực hiện kiểm tra phân quyền (ví dụ chỉ admin được sửa/xóa).
- `src/controllers/reviewController.js`: xử lý tạo/đọc/sửa/xóa review, xác thực quyền (chỉ owner hoặc admin được sửa/xóa), và cập nhật lại thông tin rating trên `Book` khi cần.
- `src/controllers/userController.js`: xử lý đăng nhập, tạo tài khoản, trả về profile, lấy danh sách user (chỉ admin), cập nhật và xóa user. Sinh JWT token cho việc xác thực.

- `src/routes/bookRoutes.js`, `src/routes/reviewRoutes.js`, `src/routes/userRoutes.js`: ánh xạ URL tới controller tương ứng và gắn middleware (`protect`, `admin`) nơi cần thiết.

- `src/middleware/authMiddleware.js`: cung cấp `protect` (xác thực JWT, nạp `req.user`) và `admin` (kiểm tra role admin).
- `src/middleware/errorHandler.js`: cung cấp `notFound` và `errorHandler` để xử lý lỗi và route không tồn tại.

- `src/app.js` và `server.js`: cấu hình Express, middleware toàn cục, route, kết nối DB và phục vụ static UI từ `src/ui`.
- `src/ui/`: giao diện tĩnh demo (index/login/books + styles + script) để minh họa cách lấy token và gọi API có bảo vệ.
- `seed.js`: script tạo dữ liệu mẫu (tài khoản admin, user, một vài sách/reviews) để phát triển và kiểm thử nhanh.

Nếu bạn muốn mình bổ sung mô tả chi tiết hơn (ví dụ liệt kê các hàm public trong mỗi controller hoặc trường schema cụ thể), cho mình biết phần bạn muốn mở rộng nhé.

## Phân quyền (Admin vs User)

Tóm tắt quyền theo role:

- **Admin**
  - Quản lý người dùng: `GET /api/users`, `GET|PUT|DELETE /api/users/:id`.
  - Quản lý sách: `POST /api/books`, `PUT|DELETE /api/books/:id`, `GET /api/books*`.
  - Quản lý review: xem/sửa/xóa mọi review (`/api/reviews` endpoints).
  - Thay đổi `role` của user qua `PUT /api/users/:id`.

- **User (xác thực)**
  - Tạo tài khoản: `POST /api/users`; đăng nhập: `POST /api/users/login`.
  - Xem/sửa profile của chính mình: `GET /api/users/profile`, `PUT /api/users/:id` (chỉ chính mình).
  - Xem sách: `GET /api/books`, `GET /api/books/:id`.
  - Tạo sách: `POST /api/books` (tuỳ cấu hình route hiện tại cho phép user đã xác thực tạo sách).
  - Quản lý review của chính mình: `POST /api/reviews`, `PUT|DELETE /api/reviews/:id` (chỉ owner hoặc admin).

Ghi chú: quyền phụ thuộc middleware gắn trên từng route (`protect`, `admin`). Nếu muốn, mình có thể liệt kê từng route kèm quyền required.
