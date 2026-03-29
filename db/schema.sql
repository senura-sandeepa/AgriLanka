create table crops_types
(
    crop_id   bigint auto_increment
        primary key,
    crop_name varchar(255) not null
);

create table locations
(
    id       bigint auto_increment
        primary key,
    province varchar(100) not null,
    district varchar(100) not null,
    city     varchar(150) not null,
    area     varchar(200) not null
);

create table roles
(
    id        bigint auto_increment
        primary key,
    role_name varchar(100) not null,
    constraint roles_role_name_uk
        unique (role_name)
);

create table users
(
    id                   bigint auto_increment
        primary key,
    firebase_uid         varchar(128)                         not null,
    email                varchar(255)                         not null,
    phone_number         varchar(30)                          null,
    is_profile_completed tinyint(1) default 0                 not null,
    status               tinyint(1) default 1                 not null,
    created_at           datetime   default CURRENT_TIMESTAMP not null,
    updated_at           datetime   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    name                 varchar(150)                         null,
    location             varchar(200)                         null,
    userType             varchar(50)                          null,
    constraint users_pk
        unique (firebase_uid)
);

create table crop_listings
(
    id             bigint auto_increment
        primary key,
    crop_id        bigint         not null,
    farmer_id      bigint         not null,
    quantity       decimal(10, 2) not null,
    available_from date           not null,
    price          decimal(10, 3) not null,
    constraint crop_listings_crops_types_crop_id_fk
        foreign key (crop_id) references crops_types (crop_id),
    constraint crop_listings_users_id_fk
        foreign key (farmer_id) references users (id)
);

create table farmer_profiles
(
    id             bigint auto_increment
        primary key,
    user_id        bigint                             not null,
    farm_name      varchar(255)                       not null,
    owner_name     varchar(255)                       not null,
    description    varchar(1000)                      null,
    location_id    bigint                             not null,
    address_no     varchar(50)                        not null,
    updated_at     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_at     datetime                           not null,
    bank_name      varchar(100)                       null,
    bank_branch    varchar(100)                       null,
    account_name   varchar(100)                       null,
    account_number varchar(50)                        null,
    constraint farmer_profiles_pk
        unique (user_id),
    constraint farmer_profiles_locations_id_fk
        foreign key (location_id) references locations (id),
    constraint farmer_profiles_users_id_fk
        foreign key (user_id) references users (id)
);

create table roles_users
(
    role_id bigint not null,
    user_id bigint not null,
    primary key (user_id, role_id),
    constraint roles_users_roles_id_fk
        foreign key (role_id) references roles (id),
    constraint roles_users_users_id_fk
        foreign key (user_id) references users (id)
);

create table storage
(
    id          bigint auto_increment
        primary key,
    farmer_id   bigint         not null,
    crop_id     bigint         not null,
    quantity    decimal(10, 2) not null,
    last_update timestamp      not null,
    constraint storage_crops_types_crop_id_fk
        foreign key (crop_id) references crops_types (crop_id),
    constraint storage_farmer_profiles_id_fk
        foreign key (farmer_id) references farmer_profiles (id)
);

create table supermarket_profiles
(
    id               bigint auto_increment
        primary key,
    user_id          bigint                             not null,
    supermarket_name varchar(255)                       not null,
    branch           varchar(255)                       null,
    contact_person   varchar(30)                        not null,
    location_id      bigint                             not null,
    created_at       datetime                           not null,
    updated_at       datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint supermarket_profiles_pk
        unique (user_id),
    constraint supermarket_profiles_locations_id_fk
        foreign key (location_id) references locations (id),
    constraint supermarket_profiles_users_id_fk
        foreign key (user_id) references users (id)
);

create table purchase_goals
(
    id                 bigint auto_increment primary key,
    supermarket_id     bigint not null,
    crop_name          varchar(255) not null,
    target_quantity    decimal(10,2) not null,
    purchased_quantity decimal(10,2) default 0,
    unit               varchar(20) default 'kg',
    target_price       decimal(10,3) null,
    created_at         datetime default CURRENT_TIMESTAMP,
    constraint purchase_goals_supermarket_profiles_id_fk
        foreign key (supermarket_id) references supermarket_profiles(id)
);
