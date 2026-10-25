create table fasilitas
(
    id    tinyint auto_increment
        primary key,
    jenis varchar(50) null
)
    collate = utf8mb4_general_ci;

create table jenis_karyawan
(
    id      char(7)     not null
        primary key,
    jabatan varchar(20) null,
    gaji    varchar(30) null
)
    collate = utf8mb4_general_ci;

create table karyawan
(
    id            char(36)     not null
        primary key,
    id_jenis      char(7)      null,
    nama          varchar(50)  null,
    jenis_kelamin varchar(15)  null,
    alamat        varchar(50)  null,
    nomor_telepon varchar(15)  null,
    email         varchar(50)  null,
    password      varchar(255) null,
    constraint karyawan_ibfk_1
        foreign key (id_jenis) references jenis_karyawan (id)
)
    collate = utf8mb4_general_ci;

create index id_jenis_karyawan
    on karyawan (id_jenis);

create table kategori
(
    id        tinyint auto_increment
        primary key,
    nama      varchar(10)  null,
    deskripsi varchar(100) null,
    constraint id
        unique (id)
)
    collate = utf8mb4_general_ci;

create table space
(
    id          char(36)    not null
        primary key,
    id_kategori tinyint     not null,
    jenis       varchar(50) null,
    harga       int         null,
    constraint space_kategori_id_fk
        foreign key (id_kategori) references kategori (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_general_ci;

create table detail_fasilitas
(
    id_space     char(36) not null,
    id_fasilitas tinyint  not null,
    primary key (id_fasilitas, id_space),
    constraint detail_fasilitas_fasilitas_fk
        foreign key (id_fasilitas) references fasilitas (id),
    constraint detail_fasilitas_space_id_fk
        foreign key (id_space) references space (id)
)
    collate = utf8mb4_general_ci;

create table detail_space
(
    id_space char(36) not null,
    kode     char(2)  not null
        primary key,
    constraint detail_space_id_space_kode_uindex
        unique (id_space, kode),
    constraint detail_space_pk
        unique (kode),
    constraint detail_space_space_id_fk
        foreign key (id_space) references space (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_general_ci;

create table user
(
    id            char(36)     not null
        primary key,
    nama          varchar(50)  null,
    email         varchar(50)  null,
    nomor_telepon varchar(20)  null,
    password      varchar(255) null
)
    collate = utf8mb4_general_ci;

create table pemesanan
(
    id          char(36) not null
        primary key,
    id_user     char(36) null,
    id_karyawan char(36) null,
    constraint pemesanan_ibfk_1
        foreign key (id_user) references user (id),
    constraint pemesanan_karyawan_fk
        foreign key (id_karyawan) references karyawan (id)
)
    collate = utf8mb4_general_ci;

create table detail_pemesanan
(
    id_pemesanan  char(36) not null,
    primary key (id_pemesanan, kode_space),
    waktu_mulai   tinyint  not null,
    waktu_akhir   tinyint  not null,
    tanggal_pesan date     not null,
    kode_space    char(2)  not null,
    constraint detail_pemesanan_detail_space_kode_fk
        foreign key (kode_space) references detail_space (kode),
    constraint detail_pemesanan_pemesanan_id_fk
        foreign key (id_pemesanan) references pemesanan (id)
            on delete cascade
)
    collate = utf8mb4_general_ci;

create index id_pemesanan
    on detail_pemesanan (id_pemesanan);

create table pembayaran
(
    id               varchar(36) not null
        primary key,
    id_pemesanan     char(36)    null,
    total_pembayaran int         null,
    metode           varchar(50) null,
    constraint pembayaran_pemesanan_id_fk
        foreign key (id_pemesanan) references pemesanan (id)
            on delete cascade
)
    collate = utf8mb4_general_ci;

create index id_pemesanan
    on pembayaran (id_pemesanan);

create index id_karyawan
    on pemesanan (id_karyawan);

create index id_user
    on pemesanan (id_user);



create table idempotency_record
(
    idempotency_key varchar(100) not null
        primary key,
    user_id         varchar(36)  null,
    request_hash    varchar(64)  null,
    status          varchar(20)  not null,
    response_code   int          null,
    response_body   text         null,
    created_at      timestamp    default current_timestamp,
    updated_at      timestamp    default current_timestamp on update current_timestamp
)
    collate = utf8mb4_general_ci;
