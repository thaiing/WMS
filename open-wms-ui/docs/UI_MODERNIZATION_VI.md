# Định hướng hiện đại hóa giao diện OpenWMS

## Hướng đã chốt

Nâng cấp theo lớp dùng chung, không viết lại từng màn hình. Cách này giữ nguyên
luồng nghiệp vụ nhưng giúp các trang mới và cũ cùng sử dụng một ngôn ngữ thiết kế.

Các nguyên tắc chính:

- Desktop ưu tiên hiệu suất thao tác; tablet và mobile tự chuyển sang bố cục dọc.
- Nội dung không được làm tràn toàn trang. Bảng rộng cuộn trong vùng bảng.
- Form dùng nhãn đủ rộng cho tiếng Việt; trên mobile nhãn chuyển lên trên ô nhập.
- Dialog luôn nằm trong viewport, phần nội dung cuộn độc lập và footer luôn nhìn thấy.
- Toolbar được phép xuống hàng theo nhóm, không ép nút và ô tìm kiếm vào một dòng.
- Dùng một hệ thống màu nền, đường viền, bo góc, bóng đổ và khoảng cách thống nhất.
- Hỗ trợ cả giao diện sáng và tối.

## Breakpoint

- Trên `1200px`: bố cục desktop đầy đủ.
- Từ `769px` đến `1200px`: giảm khoảng đệm, dialog và toolbar co giãn.
- Từ `601px` đến `900px`: các màn hình chia cây/danh sách chuyển thành hai hàng.
- Tối đa `768px`: form một cột, dialog gần toàn màn hình.
- Tối đa `600px`: phân trang rút gọn, thanh công cụ ưu tiên thao tác chính.

## Phạm vi được phủ

- `yrtDataList`: 165 màn hình danh sách.
- `yrtEditor`: 171 màn hình biểu mẫu/chi tiết.
- `splitPane`: các màn hình cây danh mục, vị trí kho và phân quyền.
- Lớp Element Plus toàn cục: bảng, dialog, drawer, form, pagination và card riêng lẻ.
- Các dashboard đã được xử lý responsive ở lớp component trang trí.

## Tiêu chí nghiệm thu

- Không có thanh cuộn ngang ở cấp toàn trang.
- Toolbar không cắt chữ hoặc chồng nút.
- Footer dialog không nằm ngoài viewport.
- Nhãn form tiếng Việt không bị bẻ từng từ.
- Bảng giữ tiêu đề dễ đọc và có trạng thái hover rõ ràng.
- Sidebar mở/thu gọn không làm thay đổi cấu trúc nội dung.
- Giao diện sáng/tối đều giữ độ tương phản phù hợp.

## Cách phát triển tiếp

Màn hình mới nên tái sử dụng `yrtDataList`, `yrtEditor` và các token `--wms-*`.
Chỉ thêm CSS riêng khi bố cục nghiệp vụ thực sự khác biệt; không đặt chiều rộng
dialog hoặc container lớn hơn viewport mà không có giới hạn responsive.
