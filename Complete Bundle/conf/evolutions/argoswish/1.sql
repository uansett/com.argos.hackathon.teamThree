# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table WishlistItem (
  id                        bigint auto_increment not null,
  id_customer               bigint,
  id_product                bigint,
  promo_notification        tinyint(1) default 0,
  price_offered             double,
  constraint pk_WishlistItem primary key (id))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table WishlistItem;

SET FOREIGN_KEY_CHECKS=1;

