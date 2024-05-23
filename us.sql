/*
 Navicat Premium Data Transfer

 Source Server         : y-database
 Source Server Type    : MySQL
 Source Server Version : 50744
 Source Host           : xxx.xx.xx.xx:3306
 Source Schema         : us

 Target Server Type    : MySQL
 Target Server Version : 50744
 File Encoding         : 65001

 Date: 08/04/2024 15:47:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dict
-- ----------------------------
DROP TABLE IF EXISTS `dict`;
CREATE TABLE `dict`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '字典id',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典名称',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '字典描述',
  `createTime` datetime NOT NULL COMMENT '字典创建时间',
  `updateTime` datetime NULL DEFAULT NULL COMMENT '字典更新时间',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updater` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dict
-- ----------------------------
INSERT INTO `dict` VALUES (1, 'status', '启用状态', '2024-03-04 15:35:52', '2024-03-12 10:57:06', NULL, 'admin');
INSERT INTO `dict` VALUES (2, 'sex', '性别', '2024-03-04 15:36:22', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for dict_details
-- ----------------------------
DROP TABLE IF EXISTS `dict_details`;
CREATE TABLE `dict_details`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '字典值id',
  `pid` int(11) NOT NULL COMMENT '字典id',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典值',
  `value` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典键',
  `dictSort` int(10) NULL DEFAULT NULL COMMENT '字典值描述',
  `createTime` datetime NULL DEFAULT NULL COMMENT '字典值创建时间',
  `updateTime` datetime NULL DEFAULT NULL COMMENT '字典值更新时间',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updater` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '字典详情表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dict_details
-- ----------------------------
INSERT INTO `dict_details` VALUES (1, 1, '启用', '1', 1, '2024-03-12 10:37:54', '2024-03-12 16:56:02', NULL, 'admin');
INSERT INTO `dict_details` VALUES (2, 1, '禁用', '0', 2, '2024-03-12 10:38:24', NULL, NULL, NULL);
INSERT INTO `dict_details` VALUES (3, 2, '男', '0', 1, '2024-03-12 10:38:47', '2024-03-13 09:32:00', NULL, 'admin');
INSERT INTO `dict_details` VALUES (4, 2, '女', '1', 2, '2024-03-12 10:39:06', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `pid` int(11) NOT NULL COMMENT 'pid',
  `path` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路由path',
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件名称',
  `visibily` tinyint(1) NOT NULL COMMENT '是否可见(0：不可见，1：可见)',
  `externalLink` tinyint(1) NOT NULL COMMENT '外部链接(0：是，1：不是)',
  `menuType` int(11) NOT NULL COMMENT '菜单类型(0:菜单，1：目录， 2：按钮)',
  `sort` int(11) NOT NULL COMMENT 'sort排序',
  `keepAlive` tinyint(1) NULL DEFAULT NULL COMMENT 'KeepAlive缓存(0：不缓存，1：缓存)',
  `icon` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图标名称',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名称',
  `link` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'link',
  `component` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `isLeaf` tinyint(1) NULL DEFAULT NULL COMMENT '是否存在子节点（0：不存在，1：存在）',
  `competence` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `updateTime` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `updater` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `createTime` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, 0, '/tools', NULL, 1, 0, 1, 1, 0, 'iconoir:tools', '工具', NULL, NULL, 0, NULL, '2024-03-18 15:12:31', 'admin', '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (2, 1, '/tools/email', 'email', 1, 0, 0, 1, 0, 'material-symbols:stacked-email-outline', '邮件', NULL, 'views/tools/email.vue', 1, '', NULL, NULL, '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (3, 0, '/link', NULL, 1, 0, 1, 2, 0, 'system-uicons:chain', '外链菜单', NULL, NULL, 0, NULL, NULL, NULL, '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (4, 3, '/link/juejing', 'Juejing', 1, 1, 0, 1, 0, 'tabler:brand-juejin', '掘金', 'https://juejin.cn/', NULL, 1, NULL, NULL, NULL, '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (5, 0, '/system', NULL, 1, 0, 1, 3, 0, 'basil:settings-alt-outline', '系统管理', NULL, NULL, 0, NULL, NULL, NULL, '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (6, 5, '/system/userRole', 'userRole', 1, 0, 0, 1, 0, 'mdi:account-tag-outline', '角色管理', NULL, 'views/system/userRole.vue', 0, 'userRole', NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (7, 0, '/component', NULL, 1, 0, 1, 3, 0, 'tabler:components', '组件管理', NULL, NULL, 0, NULL, NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (8, 7, '/component/markdownDemo', 'MarkdownDemo', 1, 0, 0, 2, 1, 'ri:markdown-line', 'Markdown', NULL, 'views/component/markdownDemo.vue', 1, NULL, NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (9, 7, '/component/richTextDemo', 'RichTextDemo', 1, 0, 0, 3, 1, 'ic:twotone-text-fields', '富文本', NULL, 'views/component/richTextDemo.vue', 1, NULL, NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (10, 5, '/system/userMenu', 'userMenu', 1, 0, 0, 2, 0, 'material-symbols:lists', '菜单管理', NULL, 'views/system/userMenu.vue', 0, 'userMenu', NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (11, 5, '/system/user', 'user', 1, 0, 0, 3, 0, 'material-symbols:manage-accounts-outline', '用户管理', NULL, 'views/system/user.vue', 0, 'user', NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (12, 5, '/system/dict', 'dict', 1, 0, 0, 4, 0, 'arcticons:colordict', '字典管理', NULL, 'views/system/dict/index.vue', 0, 'dict', NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (13, 7, '/component/draggableDrid', 'DraggableDrid', 1, 0, 0, 4, 0, 'ic:twotone-text-fields', '拖拽grid布局', NULL, 'views/component/draggableDrid.vue', 1, NULL, NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (14, 11, '', '', 0, 0, 2, 1, 0, '', '删除用户', '', '', 1, 'user:del', NULL, NULL, '2024-02-20 16:31:51', 'admin');
INSERT INTO `menu` VALUES (15, 1, '/tools/preview', 'preview', 1, 0, 0, 2, 0, 'material-symbols:preview', '预览', NULL, 'views/tools/preview.vue', 1, NULL, NULL, NULL, '2024-02-20 16:31:50', 'admin');
INSERT INTO `menu` VALUES (25, 11, '', '', 1, 0, 2, 2, 0, '', '新增用户', '', '', 1, 'user:add', NULL, NULL, '2024-04-03 14:46:14', '管理员');
INSERT INTO `menu` VALUES (26, 11, '', '', 1, 0, 2, 3, 0, '', '修改用户', '', '', 1, 'user:edit', NULL, NULL, '2024-04-03 14:46:52', '管理员');
INSERT INTO `menu` VALUES (27, 11, '', '', 1, 0, 2, 4, 0, '', '导出用户', '', '', 1, 'user:download', NULL, NULL, '2024-04-03 14:47:44', '管理员');
INSERT INTO `menu` VALUES (28, 10, '', '', 0, 0, 2, 1, 0, '', '删除菜单', '', '', 1, 'menu:del', NULL, NULL, '2024-02-20 16:31:51', '管理员');
INSERT INTO `menu` VALUES (29, 10, '', '', 1, 0, 2, 2, 0, '', '新增菜单', '', '', 1, 'menu:add', NULL, NULL, '2024-04-03 14:46:14', '管理员');
INSERT INTO `menu` VALUES (30, 10, '', '', 1, 0, 2, 3, 0, '', '修改菜单', '', '', 1, 'menu:edit', NULL, NULL, '2024-04-03 14:46:52', '管理员');
INSERT INTO `menu` VALUES (31, 6, '', '', 0, 0, 2, 1, 0, '', '删除角色', '', '', 1, 'role:del', NULL, NULL, '2024-02-20 16:31:51', '管理员');
INSERT INTO `menu` VALUES (32, 6, '', '', 1, 0, 2, 2, 0, '', '新增角色', '', '', 1, 'role:add', NULL, NULL, '2024-04-03 14:46:14', '管理员');
INSERT INTO `menu` VALUES (33, 6, '', '', 1, 0, 2, 3, 0, '', '修改角色', '', '', 1, 'role:edit', NULL, NULL, '2024-04-03 14:46:52', '管理员');
INSERT INTO `menu` VALUES (34, 6, '', '', 1, 0, 2, 4, 0, '', '导出角色', '', '', 1, 'role:download', NULL, NULL, '2024-04-03 14:47:44', '管理员');
INSERT INTO `menu` VALUES (35, 12, '', '', 0, 0, 2, 1, 0, '', '删除字典', '', '', 1, 'dict:del', NULL, NULL, '2024-02-20 16:31:51', '管理员');
INSERT INTO `menu` VALUES (36, 12, '', '', 1, 0, 2, 2, 0, '', '新增字典', '', '', 1, 'dict:add', NULL, NULL, '2024-04-03 14:46:14', '管理员');
INSERT INTO `menu` VALUES (37, 12, '', '', 1, 0, 2, 3, 0, '', '修改字典', '', '', 1, 'dict:edit', NULL, NULL, '2024-04-03 14:46:52', '管理员');
INSERT INTO `menu` VALUES (38, 12, '', '', 1, 0, 2, 4, 0, '', '导出字典', '', '', 1, 'dict:download', NULL, NULL, '2024-04-03 14:47:44', '管理员');
INSERT INTO `menu` VALUES (39, 12, '', '', 0, 0, 2, 5, 0, '', '删除字典详情', '', '', 1, 'dictDetails:del', NULL, NULL, '2024-02-20 16:31:51', '管理员');
INSERT INTO `menu` VALUES (40, 12, '', '', 1, 0, 2, 6, 0, '', '新增字典详情', '', '', 1, 'dictDetails:add', NULL, NULL, '2024-04-03 14:46:14', '管理员');
INSERT INTO `menu` VALUES (41, 12, '', '', 1, 0, 2, 7, 0, '', '修改字典详情', '', '', 1, 'dictDetails:edit', NULL, NULL, '2024-04-03 14:46:52', '管理员');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `sort` int(10) NOT NULL COMMENT '角色排序',
  `status` int(1) NOT NULL COMMENT '角色状态：1-启用、0-禁用',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `createTime` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `updater` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `creator` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '管理员', 1, 1, '平台管理员', '2024-03-06 10:04:41', '2024-03-15 09:52:22', 'admin', NULL);
INSERT INTO `role` VALUES (2, '测试', 2, 1, '测试', '2024-04-07 17:11:34', '2024-04-08 14:04:45', 'admin', 'admin');

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `menu_id` int(11) NULL DEFAULT NULL COMMENT '菜单id',
  `role_id` int(11) NULL DEFAULT NULL COMMENT '角色id'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES (11, 2);
INSERT INTO `role_menu` VALUES (9, 2);
INSERT INTO `role_menu` VALUES (13, 2);
INSERT INTO `role_menu` VALUES (7, 2);
INSERT INTO `role_menu` VALUES (8, 2);
INSERT INTO `role_menu` VALUES (14, 2);
INSERT INTO `role_menu` VALUES (3, 1);
INSERT INTO `role_menu` VALUES (7, 1);
INSERT INTO `role_menu` VALUES (1, 1);
INSERT INTO `role_menu` VALUES (8, 1);
INSERT INTO `role_menu` VALUES (9, 1);
INSERT INTO `role_menu` VALUES (11, 1);
INSERT INTO `role_menu` VALUES (4, 1);
INSERT INTO `role_menu` VALUES (6, 1);
INSERT INTO `role_menu` VALUES (10, 1);
INSERT INTO `role_menu` VALUES (5, 1);
INSERT INTO `role_menu` VALUES (2, 1);
INSERT INTO `role_menu` VALUES (12, 1);
INSERT INTO `role_menu` VALUES (14, 1);
INSERT INTO `role_menu` VALUES (13, 1);
INSERT INTO `role_menu` VALUES (15, 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户主键ID',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT '用户密码',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名称',
  `status` int(11) NOT NULL COMMENT '用户状态（0-禁用，1-启用）',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '邮箱',
  `age` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '年龄',
  `sex` int(11) NULL DEFAULT NULL COMMENT '性别（0-女，1-男）',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `updater` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '14e1b600b1fd579f47433b88e8d85291', '管理员', 1, '123@qq.com', NULL, 0, '18308797777', '2024-04-08 15:10:52', '2024-04-08 15:11:01', NULL, NULL);
INSERT INTO `user` VALUES (2, 'test001', '14e1b600b1fd579f47433b88e8d85291', '测试人员', 1, 'ddd@qq.com', '20', 0, '18308797780', '2024-03-04 16:24:08', '2024-03-22 11:30:59', 'admin', NULL);

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `role_id` int(11) NULL DEFAULT NULL COMMENT '角色id',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户id'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 5);
INSERT INTO `user_role` VALUES (2, 6);
INSERT INTO `user_role` VALUES (2, 11);
INSERT INTO `user_role` VALUES (1, 11);
INSERT INTO `user_role` VALUES (1, NULL);
INSERT INTO `user_role` VALUES (6, NULL);
INSERT INTO `user_role` VALUES (1, NULL);

SET FOREIGN_KEY_CHECKS = 1;
