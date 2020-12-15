const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");
const Op = require('sequelize').Op
const bookingManage = require("./bookingManage");
const paginate = require("./paginate");
const userProfileManage = require("./userProfileManage");

exports.updateViewNum = async (req, res) => {

}
exports.getViewNum = async (req, res) => {

}

exports.updateCommentNum = async (req, res) => {

}
exports.getCommentNum = async (req, res) => {

}

exports.updateLikeNum = async (req, res) => {

}
exports.getLikeNum = async (req, res) => {

}
