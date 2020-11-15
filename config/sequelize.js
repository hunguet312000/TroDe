const { Sequelize } = require('sequelize');
const { DataTypes } = require("sequelize");

//Sequelize
const sequelize = new Sequelize("trode", process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

async function sequelizeInit() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

const Nguoi_dung = sequelize.define('nguoi_dung', {
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
    dia_chi: {
        type: DataTypes.STRING,
        allowNull: true
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
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
        // Other model options go here
});

const Phong_tro = sequelize.define('phong_tro', {
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: true
    },
    path_anh_noi_bat: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
        // Other model options go here
});

const Tien_ich = sequelize.define('tien_ich_tien_nghi', {
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
}, {
    freezeTableName: true
});

const Hinh_anh = sequelize.define('hinh_anh', {
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
}, {
    freezeTableName: true
        // Other model options go here
});

const Binh_luan = sequelize.define('binh_luan', {
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
    id_nguoi_dung: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    noi_dung: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hinh_anh: {
        type: DataTypes.STRING(1000)
    }
}, {
    freezeTableName: true
        // Other model options go here
});

const Bao_cao = sequelize.define('bao_cao', {
    // Model attributes are defined here
    id_bao_cao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_nguoi_bao_cao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_nguoi_bi_bao_cao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    noi_dung: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hinh_anh: {
        type: DataTypes.STRING(1000)
    }
}, {
    freezeTableName: true
        // Other model options go here
});

const Quan_tri_vien = sequelize.define('quan_tri_vien', {
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
        validate: {
            isEmail: {
                msg: "Please enter a true email"
            }
        }
    },
    ngay_sinh: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
        // Other model options go here
});
// (async function() {
//   try {
//     const users = await User.findAll({
//       where: {
//         lastName: "9"
//       }
//     });
//     console.log(JSON.stringify(users,null, 2));
//   } catch (error) {
//     console.error(error);
//   }
// })();
Phong_tro.belongsTo(Nguoi_dung, {
    foreignKey: {
        name: "id_chu_so_huu",
        allowNull: false
    }
});
Nguoi_dung.hasMany(Phong_tro, {
    foreignKey: {
        name: "id_chu_so_huu",
        allowNull: false
    }
});

Tien_ich.belongsTo(Phong_tro, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    }
});
Phong_tro.hasOne(Tien_ich, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    }
});

Hinh_anh.belongsTo(Phong_tro, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    }
});
Phong_tro.hasMany(Hinh_anh, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    }
});

module.exports = {
        sequelizeInit,
        Nguoi_dung,
        Phong_tro,
        Tien_ich,
        Hinh_anh,
        Binh_luan,
        Bao_cao,
        Quan_tri_vien
    }
    //sequelizeInit();