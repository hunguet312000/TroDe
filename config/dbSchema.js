const { Sequelize } = require('sequelize');
const { DataTypes } = require("sequelize");

const nguoi_dung = {
    // Model attributes are defined here
    id_nguoi_dung: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ten_nguoi_dung: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
                msg: "Please enter a true email"
            }
        },
        unique: true,
        allowNull: false
    },
    sdt: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mat_khau: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ho_va_ten: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gioi_tinh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ngay_sinh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING(1000)
    },
    avatar_path : {
        type: DataTypes.STRING,
        allowNull: true
    },
    thanh_pho: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quan_huyen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phuong_xa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dia_chi_cu_the: {
        type: DataTypes.STRING,
        allowNull: true
    },
}

const phong_tro = {
    // Model attributes are defined here
    id_phong_tro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    thanh_pho: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quan_huyen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phuong_xa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dia_chi_cu_the: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dien_tich: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phong_ngu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phong_tam: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phong_khach: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phong_bep: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thong_tin_khac: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
    nguoi_lon: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tre_em: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tre_nho: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tong_so_nguoi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gia_phong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phan_loai: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ten_phong: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hinh_thuc_thue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phan_loai_khac: {
        type: DataTypes.STRING,
        allowNull: false
    },
    khong_lam_on: {
        type: DataTypes.STRING,
        allowNull: true
    },
    khong_hut_thuoc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    khong_thu_cung: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quy_dinh_khac: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    path_anh_noi_bat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    luot_xem: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    luot_thich: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    luot_binh_luan: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    danh_gia : {
        type : DataTypes.FLOAT,
        allowNull : true
    }
}

const tien_ich = {
    id_phong_tro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    wifi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    internet: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dieu_hoa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tv: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nong_lanh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    may_giat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tu_lanh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gia_phoi_quan_ao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cua_so: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ban_cong: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tu_quan_ao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coi_bao_chay: {
        type: DataTypes.STRING,
        allowNull: true
    },
    binh_chua_chay: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thang_may: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thang_bo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cho_do_rac: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cho_de_xe: {
        type: DataTypes.STRING,
        allowNull: true
    },
}

const hinh_anh = {
    // Model attributes are defined here
    id_anh: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    path_anh: {
        type: DataTypes.STRING(1000),
        allowNull: false
    }
}

const binh_luan = {
    // Model attributes are defined here
     id_binh_luan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_phong_tro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_nguoi_binh_luan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    noi_dung: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
    hinh_anh: {
        type: DataTypes.STRING(1000)
    }
}

const hinh_anh_bao_cao = {
    id_anh: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    path_anh: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    id_bao_cao : {
        type: DataTypes.INTEGER,
        allowNull : false,
        foreignKey : true
    }
}
const bao_cao = {
    // Model attributes are defined here
    id_bao_cao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_nguoi_dung: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_phong_tro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tieu_de : {
        type : DataTypes.STRING,
        allowNull: false
    },
    noi_dung: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tinh_trang:{
      type: DataTypes.INTEGER,
      allowNull: true
    }
}

const quan_tri_vien = {
    // Model attributes are defined here
    id_quan_tri_vien: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ten_quan_tri: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mat_khau: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sdt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: {
                msg: "Please enter a true email"
            }
        }
    },
    ngay_sinh: {
        type: DataTypes.DATE,
        allowNull: true
    },
    nguoi_dung_da_xoa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bai_dang_da_xoa: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
}

const danh_sach_yeu_thich = {
    id_phong_tro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_nguoi_dung: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}

const lich_hen = {
    id_buoi_hen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_nguoi_hen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_phong_tro: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thoi_gian: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tinh_trang:{
      type: DataTypes.INTEGER,
      allowNull: true
    }
}

module.exports = {
    nguoi_dung,
    phong_tro,
    tien_ich,
    hinh_anh,
    binh_luan,
    bao_cao,
    quan_tri_vien,
    danh_sach_yeu_thich,
    lich_hen,
    hinh_anh_bao_cao
}
