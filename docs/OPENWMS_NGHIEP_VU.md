# Tài liệu nghiệp vụ OpenWMS

## 1. Mục đích

Tài liệu mô tả các nghiệp vụ kho đang được triển khai trong OpenWMS, tập trung vào luồng nhập kho, xuất kho, tồn kho và các dữ liệu nền liên quan. Nội dung dùng cho đào tạo người dùng, kiểm thử UAT và đối chiếu khi triển khai.

Tên menu thực tế có thể thay đổi theo bản dịch, tenant và quyền của tài khoản. Menu được tải động từ backend nên người dùng chỉ nhìn thấy các chức năng đã được phân quyền.

## 2. Phạm vi

Các nhóm nghiệp vụ chính:

- Quản lý dữ liệu nền.
- Kế hoạch và thực hiện nhập kho.
- Kiểm tra chất lượng hàng nhập.
- Đưa hàng lên vị trí lưu trữ.
- Kế hoạch và thực hiện xuất kho.
- Phân bổ tồn kho và tạo đợt xuất.
- Lấy hàng, phân loại, đóng gói và giao hàng.
- Quản lý tồn kho, kiểm kê và bổ sung hàng.
- Trả hàng, điều chỉnh và các luồng ngoại lệ.

## 3. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| SKU | Một mã sản phẩm/quy cách được quản lý độc lập trong kho |
| Chủ hàng | Đơn vị sở hữu hàng hóa trong mô hình kho nhiều khách hàng |
| Lô | Nhóm hàng có chung mã lô, ngày sản xuất hoặc hạn sử dụng |
| SN | Serial number, mã định danh riêng của từng sản phẩm |
| LPN | Mã nhận dạng thùng, kiện hoặc đơn vị chứa hàng |
| Pallet | Đơn vị chứa hàng dùng khi nhận, lưu trữ hoặc xuất kho |
| Tồn vật lý | Số lượng hàng thực tế đang có trong kho |
| Tồn khả dụng | Số lượng có thể phân bổ cho đơn xuất |
| Tồn giữ chỗ | Số lượng đã được phân bổ cho đơn xuất nhưng chưa xuất vật lý |
| QC | Kiểm tra chất lượng hàng hóa |
| Putaway | Đưa hàng từ khu nhận hàng lên vị trí lưu trữ |
| Wave/đợt xuất | Nhóm các đơn xuất để tổ chức lấy hàng chung |
| Picking | Lấy hàng từ vị trí lưu trữ |
| Matching | Phân loại và ghép hàng đã lấy về đúng đơn xuất |

## 4. Dữ liệu nền

Dữ liệu nền phải được cấu hình trước khi vận hành luồng nhập hoặc xuất.

### 4.1. Tổ chức và đối tác

| Dữ liệu | Mục đích |
| --- | --- |
| Tenant/công ty | Phân tách dữ liệu giữa các tổ chức |
| Chủ hàng | Xác định quyền sở hữu tồn kho |
| Nhà cung cấp | Nguồn giao hàng trong luồng nhập |
| Khách hàng | Đối tượng nhận hàng trong luồng xuất |
| Đơn vị vận chuyển | Phục vụ vận đơn và bàn giao hàng |

### 4.2. Hàng hóa

Mỗi SKU cần xác định tối thiểu:

- Mã và tên sản phẩm.
- Barcode.
- Đơn vị tính và quy cách đóng gói.
- Chủ hàng.
- Trọng lượng và thể tích nếu cần tính tải hoặc cước.
- Có quản lý lô hay không.
- Có quản lý ngày sản xuất, hạn sử dụng hay không.
- Có quản lý SN hay không.
- Có yêu cầu kiểm tra chất lượng hay không.

### 4.3. Cấu trúc kho

| Thành phần | Mục đích |
| --- | --- |
| Kho | Phạm vi tồn kho và vận hành |
| Khu vực | Phân chia khu nhận, lưu trữ, lấy hàng, đóng gói hoặc cách ly |
| Vị trí | Điểm chứa hàng cụ thể trong kho |
| Pallet/LPN | Theo dõi hàng theo đơn vị chứa |

Vị trí cần được bật sử dụng, không bị khóa và phù hợp với quy tắc chứa hàng. Cấu hình trộn SKU, dung lượng và loại vị trí ảnh hưởng trực tiếp đến nhập, putaway và phân bổ tồn.

## 5. Tổng quan luồng nhập kho

```text
Kế hoạch nhập
→ Đơn dự kiến nhập
→ Duyệt
→ Hàng đang vận chuyển
→ Tiếp nhận/quét nhập
→ Kiểm tra chất lượng (nếu có)
→ Đưa hàng lên vị trí
→ Tồn kho khả dụng
```

Kế hoạch nhập là bước tùy chọn. Doanh nghiệp có thể tạo trực tiếp đơn dự kiến nhập nếu không cần quản lý kế hoạch.

## 6. Kế hoạch nhập kho

### 6.1. Mục đích

Ghi nhận nhu cầu hàng sẽ về kho trước khi có chứng từ tiếp nhận chính thức.

### 6.2. Thao tác

1. Vào **Nhập kho → Kế hoạch nhập kho**.
2. Chọn chủ hàng, kho và nhà cung cấp.
3. Nhập ngày dự kiến giao hàng.
4. Thêm SKU và số lượng dự kiến.
5. Kiểm tra đơn vị tính, quy cách và yêu cầu lô/SN.
6. Lưu kế hoạch.
7. Gửi duyệt và duyệt kế hoạch.
8. Chuyển kế hoạch đã duyệt thành đơn dự kiến nhập.

### 6.3. Kiểm soát

- Không chuyển kế hoạch chưa duyệt thành đơn dự kiến nhập.
- Không nhập trùng cùng một nhu cầu nếu đã sinh đơn dự kiến nhập.
- Chủ hàng và kho trên đơn phát sinh phải khớp kế hoạch.

## 7. Đơn dự kiến nhập

### 7.1. Mục đích

Là chứng từ trung tâm của quá trình tiếp nhận hàng, theo dõi số lượng dự kiến, số lượng thực nhận, QC, putaway và trả hàng.

### 7.2. Thao tác

1. Vào **Nhập kho → Đơn dự kiến nhập**.
2. Tạo mới hoặc mở đơn được sinh từ kế hoạch.
3. Kiểm tra chủ hàng, kho, nhà cung cấp và thời gian dự kiến.
4. Kiểm tra SKU, số lượng, lô và yêu cầu QC.
5. Lưu và gửi duyệt.
6. Duyệt đơn.
7. Chuyển sang trạng thái đang vận chuyển khi nhà cung cấp bắt đầu giao.
8. Chuyển sang chờ nhập khi xe hoặc hàng đến kho.

### 7.3. Trạng thái chính

| Trạng thái | Ý nghĩa |
| --- | --- |
| Mới tạo | Đơn đang được soạn |
| Chờ duyệt | Đơn đang chờ người có thẩm quyền xử lý |
| Duyệt thành công | Đơn đủ điều kiện tiếp tục |
| Duyệt thất bại | Đơn bị từ chối |
| Đang vận chuyển | Hàng đang trên đường tới kho |
| Chờ nhập kho | Hàng đã sẵn sàng để tiếp nhận |
| Đang nhập kho | Đã phát sinh thao tác nhận hàng |
| Giao một phần | Số lượng nhận nhỏ hơn số lượng dự kiến |
| Giao hoàn tất | Đã nhận đủ hoặc đã chốt việc nhận hàng |
| Hoàn thành cưỡng chế | Đóng đơn dù chưa nhận đủ |
| Trả một phần/toàn bộ | Hàng đã được xử lý trả nhà cung cấp |

## 8. Tiếp nhận và quét nhập

### 8.1. Luồng theo đơn

1. Vào **Nhập kho → Quét nhập theo đơn**.
2. Quét hoặc nhập mã đơn dự kiến nhập.
3. Chọn vị trí/khu vực nhận hàng.
4. Quét barcode SKU.
5. Nhập số lượng thực nhận.
6. Nhập mã lô nếu SKU quản lý lô.
7. Nhập ngày sản xuất và hạn sử dụng nếu được quản lý.
8. Quét SN nếu SKU quản lý serial.
9. Quét hoặc gán pallet/LPN nếu quy trình sử dụng đơn vị chứa.
10. Xác nhận dòng tiếp nhận.
11. Lặp lại đến khi tiếp nhận xong.

### 8.2. Xử lý tự động

Khi xác nhận tiếp nhận, hệ thống thực hiện chuỗi xử lý:

```text
Kiểm tra dữ liệu
→ Ghi nhận tiếp nhận
→ Sinh phiếu QC nếu cần
→ Sinh nhiệm vụ putaway
→ Cập nhật tồn kho
→ Gửi sự kiện tích hợp
```

### 8.3. Kiểm soát

- SKU quét phải thuộc đơn hoặc được phép nhận ngoài đơn.
- Số lượng không được vượt quy tắc cho phép của đơn.
- Lô, ngày sản xuất, hạn sử dụng và SN phải đúng định dạng.
- Một SN không được nhận trùng.
- Vị trí nhận phải hoạt động và thuộc đúng kho.

## 9. Kiểm tra chất lượng

Phiếu QC chỉ được sinh khi đơn và cấu hình nghiệp vụ yêu cầu kiểm tra chất lượng.

### 9.1. Thao tác

1. Vào **Nhập kho → Kiểm tra chất lượng**.
2. Mở phiếu được sinh từ lần tiếp nhận.
3. Đối chiếu SKU, lô và số lượng nhận.
4. Nhập số lượng đạt.
5. Nhập số lượng không đạt hoặc cần cách ly.
6. Ghi nhận lý do, kết quả và tài liệu liên quan.
7. Xác nhận hoàn thành QC.

### 9.2. Kết quả

| Kết quả | Xử lý tiếp theo |
| --- | --- |
| Đạt | Cho phép đưa lên vị trí lưu trữ |
| Không đạt | Đưa vào khu cách ly, từ chối nhận hoặc tạo trả hàng |
| Kiểm tra một phần | Chỉ phần đã kiểm tra được xử lý tiếp theo theo cấu hình |

## 10. Đưa hàng lên vị trí lưu trữ

### 10.1. Thao tác

1. Vào màn hình nhiệm vụ đưa hàng lên vị trí hoặc quét putaway.
2. Quét phiếu, pallet hoặc LPN.
3. Quét vị trí nguồn tại khu nhận hàng.
4. Quét vị trí đích trong khu lưu trữ.
5. Nhập số lượng thực đưa lên vị trí.
6. Xác nhận hoàn thành.

### 10.2. Trạng thái

| Trạng thái | Ý nghĩa |
| --- | --- |
| Chờ đưa lên vị trí | Nhiệm vụ đã sinh nhưng chưa thực hiện |
| Đang thực hiện | Đã bắt đầu quét putaway |
| Hoàn thành một phần | Chỉ một phần hàng đã tới vị trí đích |
| Hoàn thành | Toàn bộ hàng đã tới vị trí đích |
| Hoàn thành cưỡng chế | Nhiệm vụ được đóng thủ công |

Nếu vị trí nhận được cấu hình là vị trí nhập trực tiếp, hệ thống có thể hoàn thành putaway ngay khi tiếp nhận.

## 11. Các luồng nhập kho khác

| Luồng | Khi sử dụng |
| --- | --- |
| Nhập không có đơn | Hàng đến kho nhưng chưa có đơn dự kiến nhập |
| Nhập theo LPN | Hàng được quản lý theo thùng hoặc kiện có mã LPN |
| Nhập theo pallet | Tiếp nhận cả pallet thay vì từng đơn vị hàng |
| Nhập hàng hư hỏng | Ghi nhận riêng hàng lỗi hoặc hỏng |
| Từ chối nhận | Hàng không đạt điều kiện tiếp nhận |
| Trả hàng nhập | Trả hàng đã nhận về nhà cung cấp |
| Đổi hàng | Theo dõi hàng đổi với nhà cung cấp |
| Nhập thủ công | Điều chỉnh tăng tồn ngoài luồng mua/nhận chuẩn |

Các luồng ngoại lệ cần quyền riêng và phải có lý do, chứng từ đối chiếu.

## 12. Tổng quan luồng xuất kho

```text
Kế hoạch xuất
→ Đơn xuất
→ Duyệt
→ Phân bổ/giữ chỗ tồn kho
→ Tạo đợt xuất
→ Lấy hàng
→ Phân loại theo đơn
→ Đóng gói
→ Xác nhận xuất kho
→ Bàn giao vận chuyển
→ Ký nhận/hoàn tất
```

Kế hoạch xuất là bước tùy chọn. Đơn xuất có thể được tạo trực tiếp nếu quy trình không yêu cầu kế hoạch.

## 13. Kế hoạch và đơn xuất kho

### 13.1. Kế hoạch xuất

1. Vào **Xuất kho → Kế hoạch xuất kho**.
2. Chọn chủ hàng, kho và khách hàng.
3. Nhập địa chỉ giao hàng và đơn vị vận chuyển.
4. Thêm SKU và số lượng cần xuất.
5. Khai báo yêu cầu lô, hạn sử dụng hoặc quy cách nếu có.
6. Lưu và duyệt kế hoạch.
7. Chuyển kế hoạch thành đơn xuất.

### 13.2. Đơn xuất

1. Vào **Xuất kho → Đơn xuất kho**.
2. Tạo mới hoặc mở đơn được sinh từ kế hoạch.
3. Kiểm tra khách hàng, địa chỉ, kho, chủ hàng và SKU.
4. Lưu và gửi duyệt.
5. Duyệt đơn.
6. Thực hiện phân bổ tồn kho.

## 14. Phân bổ tồn kho

### 14.1. Mục đích

Chọn tồn kho phù hợp và giữ chỗ cho đơn xuất. Phân bổ chưa làm giảm tồn vật lý.

### 14.2. Điều kiện lựa chọn tồn

- Đúng kho và chủ hàng.
- Đúng SKU và quy cách.
- Đúng lô nếu đơn yêu cầu.
- Vị trí và tồn kho đang hoạt động.
- Số lượng khả dụng lớn hơn không.
- Đáp ứng quy tắc ngày sản xuất, ngày nhập hoặc hạn sử dụng.

### 14.3. Kết quả

| Kết quả | Ý nghĩa |
| --- | --- |
| Chưa phân bổ | Chưa chạy hoặc chưa có kết quả phân bổ |
| Đã phân bổ | Đủ toàn bộ số lượng yêu cầu |
| Phân bổ một phần | Chỉ giữ được một phần số lượng |
| Thiếu hàng | Không đủ tồn khả dụng |
| Đơn có vấn đề | Dữ liệu hoặc quy tắc không hợp lệ |

Khi thiếu hàng, người vận hành cần nhập thêm hàng, bổ sung hàng, điều chỉnh đơn hoặc xử lý ngoại lệ trước khi tạo đợt xuất.

## 15. Tạo đợt xuất

### 15.1. Mục đích

Gom các đơn đã phân bổ để tổ chức lấy hàng hiệu quả.

### 15.2. Thao tác

1. Vào **Xuất kho → Quản lý đợt xuất**.
2. Chọn các đơn đã phân bổ.
3. Chọn quy tắc gom đợt.
4. Tạo đợt xuất.
5. Kiểm tra nhiệm vụ lấy hàng được sinh.

Đợt xuất thường được nhóm theo kho, chủ hàng và có thể theo đơn vị vận chuyển hoặc cấu hình nghiệp vụ khác.

## 16. Lấy hàng

### 16.1. Thao tác

1. Vào **Xuất kho → Quét lấy hàng**.
2. Nhận hoặc mở nhiệm vụ lấy hàng.
3. Quét mã đợt xuất/nhiệm vụ.
4. Tới và quét vị trí nguồn được chỉ định.
5. Quét SKU, lô, SN, pallet hoặc LPN.
6. Nhập số lượng thực lấy.
7. Đưa hàng tới khu phân loại/đóng gói.
8. Xác nhận hoàn thành nhiệm vụ.

### 16.2. Kiểm soát

- Không lấy khác vị trí hoặc lô đã phân bổ khi chưa có xử lý thay thế.
- Không lấy vượt số lượng nhiệm vụ.
- SN phải khớp SKU và tồn tại tại vị trí nguồn.
- Chênh lệch phải được ghi nhận trước khi đóng nhiệm vụ.

## 17. Phân loại và ghép hàng theo đơn

Đây là thao tác vật lý sau khi lấy hàng, khác với phân bổ tồn kho.

1. Vào **Xuất kho → Quét phân loại/Ghép hàng**.
2. Quét đợt xuất hoặc container chứa hàng đã lấy.
3. Quét đơn xuất đích.
4. Quét từng SKU và số lượng.
5. Ghép đúng hàng vào đúng đơn.
6. Xác nhận khi đơn đã đủ.

Trạng thái chính gồm chờ phân loại, đang phân loại, phân loại một phần và phân loại hoàn tất.

## 18. Đóng gói và xác nhận xuất kho

### 18.1. Đóng gói

1. Vào màn hình đóng gói/xác nhận xuất.
2. Quét đơn xuất hoặc mã kiện.
3. Quét lại SKU để đối chiếu.
4. Chọn vật tư đóng gói.
5. Nhập số kiện, trọng lượng và kích thước nếu cần.
6. Sinh mã kiện hoặc vận đơn.
7. In nhãn và chứng từ.
8. Xác nhận hoàn thành kiện.

### 18.2. Xác nhận xuất

Khi xác nhận xuất, hệ thống:

- Tạo chi tiết kiện hàng.
- Giảm lượng tồn giữ chỗ.
- Giảm tồn vật lý và tồn khả dụng.
- Ghi lịch sử xuất kho.
- Cập nhật trạng thái đơn.

Không xác nhận xuất trước khi hàng thực tế đã qua điểm kiểm soát cuối cùng.

## 19. Bàn giao và giao hàng

1. Xác nhận trọng lượng nếu quy trình yêu cầu cân.
2. Gán đơn vị vận chuyển và mã vận đơn.
3. Xác nhận bàn giao cho tài xế hoặc tại cổng.
4. Cập nhật vận chuyển một phần hoặc hoàn tất.
5. Cập nhật ký nhận, giao thành công, từ chối nhận hoặc trả hàng.

Các trạng thái cuối có thể gồm đã xuất, vận chuyển hoàn tất, đã ký nhận, đã giao, từ chối nhận, trả hàng hoặc đóng đơn.

## 20. Các luồng xuất kho khác

| Luồng | Khi sử dụng |
| --- | --- |
| Xuất nhanh | Luồng rút gọn đã được phê duyệt, bỏ qua một số công đoạn chuẩn |
| Xuất hàng loạt | Xử lý đồng thời nhiều đơn |
| Xuất theo pallet/LPN | Xuất cả đơn vị chứa hàng |
| Xuất không có đơn | Xuất ngoại lệ không theo đơn bán hàng chuẩn |
| Xuất thủ công | Điều chỉnh giảm tồn có kiểm soát |
| Trả hàng xuất | Nhận lại hàng khách trả sau khi đã xuất |
| Hủy đơn | Dừng đơn trước khi xuất vật lý và giải phóng tồn giữ chỗ |
| Hoàn thành cưỡng chế | Đóng đơn chưa hoàn tất sau khi đã đối soát |

## 21. Quản lý tồn kho

### 21.1. Các loại số lượng

| Số lượng | Ý nghĩa |
| --- | --- |
| Tồn vật lý | Hàng thực tế trong kho |
| Tồn khả dụng | Hàng có thể phân bổ cho đơn mới |
| Tồn giữ chỗ | Hàng đã dành cho đơn xuất |
| Tồn khóa/cách ly | Hàng không được phép xuất thông thường |

Quan hệ nghiệp vụ thông thường:

```text
Tồn khả dụng = Tồn vật lý - Tồn giữ chỗ - Tồn khóa/cách ly
```

Hệ thống không cho phép nghiệp vụ xuất làm tồn vật lý âm.

### 21.2. Chuyển vị trí

1. Chọn hoặc quét vị trí nguồn.
2. Chọn SKU/lô cần chuyển.
3. Nhập số lượng.
4. Quét vị trí đích.
5. Xác nhận chuyển.
6. Đối chiếu tồn ở cả vị trí nguồn và đích.

### 21.3. Kiểm kê

1. Tạo phiếu theo kho, khu vực, vị trí hoặc SKU.
2. Khóa phạm vi kiểm kê nếu quy trình yêu cầu.
3. Ghi nhận số lượng đếm thực tế.
4. Gửi kết quả kiểm kê.
5. Đối chiếu số hệ thống và số thực tế.
6. Sinh phiếu thừa/thiếu.
7. Duyệt chênh lệch.
8. Điều chỉnh tồn.
9. Mở khóa phạm vi kiểm kê.

### 21.4. Bổ sung hàng

1. Tạo yêu cầu bổ sung từ khu lưu trữ tới khu lấy hàng.
2. Duyệt yêu cầu.
3. Phân bổ tồn nguồn.
4. Nhận nhiệm vụ bổ sung.
5. Quét vị trí nguồn, SKU và số lượng.
6. Quét vị trí đích.
7. Xác nhận hoàn thành.

### 21.5. Nghiệp vụ tồn kho khác

- Điều chỉnh tăng hoặc giảm tồn.
- Xử lý thừa thiếu.
- Chuyển chủ hàng.
- Lắp ráp và tháo bộ sản phẩm.
- Khóa/mở khóa vị trí.
- Quản lý hàng lỗi và hàng cách ly.
- Theo dõi lô, SN và hạn sử dụng.
- Theo dõi lịch sử biến động.
- Điều chỉnh giá vốn.
- Quản lý pallet và đơn vị chứa.

## 22. Vai trò và kiểm soát đề xuất

| Vai trò | Trách nhiệm chính |
| --- | --- |
| Điều phối nhập | Tạo kế hoạch và đơn dự kiến nhập |
| Nhân viên nhận hàng | Quét nhận, lô, SN, pallet/LPN |
| Nhân viên QC | Ghi nhận kết quả chất lượng |
| Nhân viên putaway | Đưa hàng lên vị trí |
| Điều phối xuất | Tạo, duyệt và phân bổ đơn xuất |
| Nhân viên lấy hàng | Thực hiện nhiệm vụ picking |
| Nhân viên phân loại/đóng gói | Ghép đơn, đóng gói và in nhãn |
| Nhân viên giao nhận | Bàn giao và cập nhật vận chuyển |
| Kiểm soát tồn kho | Kiểm kê, điều chỉnh và đối soát |
| Quản trị hệ thống | Dữ liệu nền, tenant, tài khoản và phân quyền |

Người tạo và người duyệt nên là hai vai trò khác nhau đối với chứng từ quan trọng. Hoàn thành cưỡng chế, điều chỉnh tồn, xuất không đơn và reset trạng thái phải được giới hạn quyền và ghi lý do.

## 23. Kịch bản UAT nhập và xuất chuẩn

### 23.1. Chuẩn bị

1. Tạo một SKU thử nghiệm có barcode.
2. Chuẩn bị một chủ hàng, nhà cung cấp và khách hàng.
3. Chuẩn bị kho, vị trí nhận hàng, vị trí lưu trữ và vị trí lấy hàng.
4. Bật quản lý lô hoặc SN nếu cần kiểm thử.

### 23.2. Kiểm thử nhập

1. Tạo kế hoạch nhập 10 sản phẩm.
2. Duyệt và chuyển thành đơn dự kiến nhập.
3. Duyệt đơn và chuyển sang chờ nhập.
4. Quét nhận đủ 10 sản phẩm.
5. Hoàn thành QC nếu hệ thống sinh phiếu.
6. Đưa đủ 10 sản phẩm lên vị trí lưu trữ.
7. Xác nhận tồn vật lý và tồn khả dụng đều bằng 10.

### 23.3. Kiểm thử xuất

1. Tạo đơn xuất 4 sản phẩm.
2. Duyệt và phân bổ tồn.
3. Xác nhận tồn giữ chỗ bằng 4 và tồn khả dụng còn 6.
4. Tạo đợt xuất.
5. Lấy đủ 4 sản phẩm.
6. Phân loại và đóng gói.
7. Xác nhận xuất kho.
8. Xác nhận tồn vật lý còn 6 và tồn giữ chỗ bằng 0.
9. Xác nhận vận chuyển và ký nhận.

Không dùng xuất nhanh, điều chỉnh tồn hoặc hoàn thành cưỡng chế trong lần UAT đầu vì các thao tác này có thể che lỗi trong luồng chuẩn.

## 24. Đối soát sau nghiệp vụ

Sau mỗi luồng cần đối chiếu:

- Trạng thái chứng từ.
- Số lượng dự kiến và thực tế.
- Tồn vật lý, khả dụng và giữ chỗ.
- Lô, SN, pallet/LPN và vị trí.
- Lịch sử thao tác và người thực hiện.
- Phiếu QC, putaway, picking, package và vận chuyển liên quan.
- Thông điệp hoặc trạng thái tích hợp nếu có ERP/WCS/carrier.

## 25. Lưu ý triển khai

- Quyền menu phụ thuộc tenant, vai trò và cấu hình backend.
- Quy tắc QC, phân bổ, tạo wave và tự động sinh chứng từ có thể khác theo cấu hình runtime.
- Không dùng dữ liệu seed làm chuẩn vận hành production nếu chưa rà soát chủ hàng, kho, vị trí và tài khoản.
- Cần chạy UAT bằng luồng chuẩn trước khi bật luồng nhanh hoặc ngoại lệ.
- Cần thiết lập quy trình backup và đối soát trước khi cho phép điều chỉnh tồn.

## 26. Tham chiếu kỹ thuật

- Luồng nhập: `open-wms/rattan-modules/rattan-inbound`.
- Luồng xuất: `open-wms/rattan-modules/rattan-outbound`.
- Tồn kho: `open-wms/rattan-modules/rattan-inventory`.
- Dữ liệu nền: `open-wms/rattan-modules/rattan-basic`.
- Trạng thái nghiệp vụ: `open-wms/rattan-common/rattan-common-core/src/main/java/com/yiruantong/common/core/enums`.
- Màn hình nhập: `open-wms-ui/src/views/inbound`.
- Màn hình xuất: `open-wms-ui/src/views/outbound`.
- Màn hình tồn kho: `open-wms-ui/src/views/inventory`.

Cập nhật lần cuối: 2026-07-28.
