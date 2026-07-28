# OpenWMS Cookbook

Runbook cho viec khoi dong, kiem tra va cap nhat OpenWMS trong moi truong local/dev.

## Thanh phan

| Dich vu | Dia chi | Ghi chu |
| --- | --- | --- |
| Frontend | http://localhost:8722 | Vue 3 + Vite |
| Backend | http://localhost:7861 | Spring Boot 3, Java 17 |
| Backend health | http://localhost:7861/actuator/health | Phai tra ve `status: UP` |
| MySQL | `localhost:3306` | Database `yrt-open-wms` |
| Redis | `localhost:6379` | Co password trong `compose.yaml` |
| MongoDB | `localhost:27017` | Authentication database `admin` |
| RabbitMQ | `localhost:5672` | Management UI: http://localhost:15672 |
| MinIO | `localhost:9000` | Console: http://localhost:9001 |

Toan bo cau hinh local nam trong [`compose.yaml`](compose.yaml). Khong dua cac mat khau dev nay vao moi truong public.

## Dieu kien

- Git.
- Docker Engine dang chay.
- Docker Compose v2 (`docker compose version`).
- Cac cong trong bang tren dang trong.
- Dang o thu muc goc repository.

## Chay lan dau

```bash
git switch dev
git pull --ff-only
docker compose up -d --build --remove-orphans
```

Lan dau MySQL se import [`open-wms/script/sql/open-wms.sql`](open-wms/script/sql/open-wms.sql). Backend cung build 40 Maven module truoc khi chay, vi vay co the mat vai phut.

Theo doi tien trinh:

```bash
docker compose ps --all
docker compose logs -f backend frontend
```

Dung `Ctrl+C` de thoat log; container van tiep tuc chay.

## Kiem tra sau khi chay

### 1. Container

```bash
docker compose ps --all
```

Ket qua mong doi:

- `backend`, `frontend`, `mysql`, `redis`, `mongo`, `rabbitmq`, `minio` o trang thai `Up`.
- `mysql`, `redis`, `mongo`, `rabbitmq` o trang thai `healthy`.
- `rabbitmq-init` o trang thai `Exited (0)`; day la one-shot job, khong phai loi.

### 2. Backend va frontend

```bash
curl --fail http://localhost:7861/actuator/health
curl --fail --output /dev/null --write-out '%{http_code}\n' http://localhost:8722
curl --fail --output /dev/null --write-out '%{http_code}\n' http://localhost:8722/dev-api/auth/tenant/list
```

Ket qua mong doi: health co `"status":"UP"`, hai lenh con lai tra ve `200`.

### 3. Du lieu khoi tao

```bash
docker compose exec -T mysql sh -lc 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -Nse '\''SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = "yrt-open-wms";'\'''
docker compose exec -T rabbitmq rabbitmqctl list_exchanges name type durable
```

MySQL phai co bang du lieu (file seed hien tai tao khoang 296 bang). RabbitMQ phai co durable topic exchange `yrt.topic.wms`.

## Cap nhat code va chay lai

Kiem tra worktree truoc khi cap nhat de khong ghi de thay doi chua commit:

```bash
git status --short --branch
git pull --ff-only
```

Frontend dung bind mount va Vite hot reload, nen thay doi UI thuong khong can restart. Sau thay doi backend hoac dependency frontend:

```bash
docker compose restart backend frontend
docker compose logs -f backend frontend
```

Khong nen `docker compose restart` toan bo stack: `rabbitmq-init` co the chay truoc khi RabbitMQ san sang. Neu da gap truong hop nay:

```bash
docker compose up --no-deps rabbitmq-init
docker compose restart backend
```

Sau do chay lai cac lenh trong muc **Kiem tra sau khi chay**.

## Dung va reset

Dung stack nhung giu nguyen du lieu:

```bash
docker compose down --remove-orphans
```

Xoa toan bo du lieu local va seed lai tu dau:

```bash
docker compose down --volumes --remove-orphans
docker compose up -d --build --remove-orphans
```

Canh bao: lenh co `--volumes` xoa MySQL, Redis, MongoDB, RabbitMQ, MinIO va cache dependency local cua stack.

## Xu ly su co

### Backend chua tra health

Backend build Maven va khoi tao Spring Boot moi lan container restart. Kiem tra no van dang build/khoi dong:

```bash
docker compose logs --since=10m backend
```

Cho den khi log bao ung dung da started, sau do goi lai `/actuator/health`.

### `rabbitmq-init` thoat voi code 1

Nguyen nhan thuong gap la RabbitMQ dang restart. Cho `rabbitmq` healthy roi chay lai:

```bash
docker compose up --no-deps rabbitmq-init
```

### Database khong nhan thay doi trong file SQL

Script trong `/docker-entrypoint-initdb.d` chi chay khi volume MySQL rong. Neu chap nhan xoa du lieu local, dung quy trinh **Xoa toan bo du lieu local** o tren.

### Cong da duoc su dung

Tim container dang chiem cong va dung stack cu truoc khi chay lai:

```bash
docker ps
docker compose down --remove-orphans
```

### Frontend khong cap nhat dependency

Container luu `node_modules` trong named volume. Chi xoa volume dependency frontend khi `npm install` khong tu dong cap nhat dung:

```bash
docker compose stop frontend
docker volume rm open-wms-v2_frontend-node-modules
docker compose up -d frontend
```

## Build kiem tra

```bash
docker compose exec -T frontend npm run build
docker compose exec -T backend mvn -Pdev -Dmaven.test.skip=true package
```

## Gioi han trien khai

`compose.yaml` hien la stack development:

- Frontend chay Vite dev server, khong phai static production build.
- Backend build source ngay khi container khoi dong.
- Source code duoc bind mount vao container.
- Credential va port duoc khai bao truc tiep cho local.
- Chua co TLS, reverse proxy, secret manager, backup hay resource limit.

Khong deploy file nay truc tiep len production. Can mot cau hinh production rieng voi image da build san, secret tu bien moi truong/secret manager, TLS, backup volume va health/restart policy.

## Tai lieu lien quan

- [Tài liệu chi tiết nghiệp vụ OpenWMS](docs/OPENWMS_NGHIEP_VU.md)
- [Bản Word tài liệu nghiệp vụ OpenWMS](docs/OPENWMS_NGHIEP_VU.docx)
- [Backend README](open-wms/README.md)
- [Frontend README](open-wms-ui/README.md)
- [UI modernization](open-wms-ui/docs/UI_MODERNIZATION_VI.md)

Cap nhat lan cuoi: 2026-07-28.
