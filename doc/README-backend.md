# Backend - Book Manager

Tài liệu ngắn mô tả server (backend) của project Book Manager.

## Tổng quan
- Ứng dụng backend viết bằng Node.js + Express. Cung cấp REST API để quản lý sách, người dùng, và đánh giá.
- Kết nối MongoDB (mongoose) để lưu dữ liệu.
- Sử dụng `firebase-admin` để gửi Firebase Cloud Messaging (FCM) từ server (broadcast hoặc gửi tới tokens cụ thể).

## Các tính năng chính
- Quản lý sách: tạo, sửa, xóa, lấy danh sách, xem chi tiết (`/api/books`).
- Quản lý người dùng: đăng ký, đăng nhập, thông tin profile (`/api/users`).
- Đánh giá sách: thêm, liệt kê đánh giá (`/api/reviews`).
- Admin broadcast notification: endpoint POST `/api/admin/broadcast` (bảo vệ bởi middleware `protect`) để gửi notification tới các `fcmTokens` của users.

## Các file/điểm quan trọng
- `src/services/firebaseAdmin.js` — khởi tạo `firebase-admin` từ service account và chứa hàm `sendMulticastNotification`.
- `src/controllers/notificationController.js` — controller thực hiện broadcast.
- `src/routes/adminRoutes.js` — route đăng ký endpoint `/api/admin/broadcast`.
- `server.js`, `src/app.js` — khởi chạy server và cấu hình middleware/routes.

## Biến môi trường (ENV)
- `PORT` — cổng server (mặc định `9999`).
- `MONGO_URI` — connection string MongoDB.
- `JWT_SECRET` — secret để sign JWT.
- `FIREBASE_SERVICE_ACCOUNT_PATH` hoặc `FIREBASE_SERVICE_ACCOUNT_JSON` — service account JSON cho `firebase-admin`.

Lưu ý: file service account JSON và `.env` là nhạy cảm — đã được thêm vào `.gitignore`.

## Cài đặt & chạy
1. Cài dependencies:

```bash
npm install
```

2. Tạo file `.env` với ít nhất `MONGO_URI`, `JWT_SECRET`, `FIREBASE_SERVICE_ACCOUNT_PATH` (hoặc `FIREBASE_SERVICE_ACCOUNT_JSON`).

3. Chạy server:

```bash
npm run dev
```

## Gửi thử Notification (ví dụ)
- Endpoint: `POST /api/admin/broadcast` (yêu cầu header `Authorization: Bearer <ADMIN_JWT>`)
- Payload JSON ví dụ:

```json
{
  "title": "Thông báo thử",
  "body": "Nội dung thông báo",
  "data": { "key": "value" }
}
```

- Dùng curl:

```bash
curl -X POST http://localhost:9999/api/admin/broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -d '{"title":"Test","body":"Hello","data":{"foo":"bar"}}'
```

## Ghi chú bảo mật
- Nếu các file nhạy cảm (như service account JSON, `.env`) đã bị commit, hãy gỡ track bằng:

```bash
git rm --cached path/to/file
git commit -m "Stop tracking sensitive file"
git push
```

## Liên hệ
- Nếu cần mình có thể: kiểm tra quyền service account, thử gửi broadcast thực tế, hoặc gỡ track các file đã commit giúp bạn.
