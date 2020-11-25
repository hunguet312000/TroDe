const { Sequelize } = require('sequelize');
const { DataTypes } = require("sequelize");
const schema = require("./dbSchema");
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

const Nguoi_dung = sequelize.define('nguoi_dung', schema.nguoi_dung, {
    freezeTableName: true
        // Other model options go here
});

const Phong_tro = sequelize.define('phong_tro', schema.phong_tro, {
    freezeTableName: true
        // Other model options go here
});

const Tien_ich = sequelize.define('tien_ich_tien_nghi', schema.tien_ich, {
    freezeTableName: true
});

const Hinh_anh = sequelize.define('hinh_anh', schema.hinh_anh, {
    freezeTableName: true
        // Other model options go here
});

const Binh_luan = sequelize.define('binh_luan', schema.binh_luan, {
    freezeTableName: true
        // Other model options go here
});

const Bao_cao = sequelize.define('bao_cao', schema.bao_cao, {
    freezeTableName: true
        // Other model options go here
});

const Quan_tri_vien = sequelize.define('quan_tri_vien', schema.quan_tri_vien, {
    freezeTableName: true
        // Other model options go here
});

const Danh_sach_yeu_thich = sequelize.define('danh_sach_yeu_thich', schema.danh_sach_yeu_thich, {
    freezeTableName: true
});

// Phong tro va Nguoi dung
Phong_tro.belongsTo(Nguoi_dung, {
    foreignKey: {
        name: "id_chu_so_huu",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Nguoi_dung.hasMany(Phong_tro, {
    foreignKey: {
        name: "id_chu_so_huu",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Phong tro va Tien ich
Tien_ich.belongsTo(Phong_tro, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Phong_tro.hasOne(Tien_ich, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Phong tro va Hinh anh
Hinh_anh.belongsTo(Phong_tro, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Phong_tro.hasMany(Hinh_anh, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Phong tro va Binh luan
Binh_luan.belongsTo(Phong_tro, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Phong_tro.hasMany(Binh_luan, {
    foreignKey: {
        name: "id_phong_tro",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Binh luan  va Nguoi dung
Binh_luan.belongsTo(Nguoi_dung, {
    foreignKey: {
        name: "id_nguoi_binh_luan",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Nguoi_dung.hasMany(Binh_luan, {
    foreignKey: {
        name: "id_nguoi_binh_luan",
        allowNull: false,
        primaryKey: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

//Danh sach yeu thich
Nguoi_dung.belongsToMany(Phong_tro, {
    through: 'Danh_sach_yeu_thich',
    foreignKey: {
        name: "id_nguoi_dung"
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Phong_tro.belongsToMany(Nguoi_dung, {
    through: 'Danh_sach_yeu_thich',
    foreignKey: {
        name: "id_phong_tro"
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
//
// Danh_sach_yeu_thich.belongsTo(Nguoi_dung,{
//   foreignKey: {
//     name: "id_nguoi_dung",
//     allowNull: false,
//     primaryKey: true
//   }
// });
// Nguoi_dung.hasMany(Danh_sach_yeu_thich,{
//   foreignKey: {
//     name: "id_nguoi_dung",
//     allowNull: false,
//     primaryKey: true
//   }
// });
//
// Danh_sach_yeu_thich.belongsTo(Phong_tro,{
//   foreignKey: {
//     name: "id_phong_tro",
//     allowNull: false,
//     primaryKey: true
//   }
// });
// Phong_tro.hasMany(Danh_sach_yeu_thich,{
//   foreignKey: {
//     name: "id_phong_tro",
//     allowNull: false,
//     primaryKey: true
//   }
// });

module.exports = {
        sequelizeInit,
        Nguoi_dung,
        Phong_tro,
        Tien_ich,
        Hinh_anh,
        Binh_luan,
        Bao_cao,
        Quan_tri_vien,
        Danh_sach_yeu_thich,
        sequelize
    }
    //sequelizeInit();