    /*$('input.numberformat').keyup(function(event) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        // skip for arrow keys
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (event.which >= 37 && event.which <= 40) return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        // format number
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        $(this).val(function(index, value) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            return value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .replace(/\D/g, "")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    });*/
    $(".imgAdd").click(function() {
        $(this).closest(".row").find('.imgAdd').before('<div class="col-sm-3 imgUp"><div class="imagePreview"></div><label class="btn btn-primary" id="btn-upload">Tải ảnh lên<input type="file" name = "image" class="uploadFile img" value="Upload Photo" style="width:0px;height:0px;overflow:hidden;"></label><i class="fas fa-trash-alt del"></i></div>');
    });
    $(document).on("click", "i.del", function() {
        $(this).parent().remove();
    });
    $(function() {
        $(document).on("change", ".uploadFile", function() {
            var uploadFile = $(this);
            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
            if (/^image/.test(files[0].type)) { // only image file
                var reader = new FileReader(); // instance of the FileReader
                reader.readAsDataURL(files[0]); // read the local file
                reader.onloadend = function() { // set image data as background of div
                    //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                    uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" + this.result + ")");
                }
            }
        });
        var info = {
            "Quận Ba Đình": ["Phường Cống Vị", "Phường Điện Biên", "Phường Đội Cấn", "Phường Giảng Võ",
                "Phường Kim Mã", "Phường Liễu Giai", "Phường Ngọc Hà", "Phường Ngọc Khánh", "Phường Nguyễn Trung Trực",
                "Phường Phúc Xá", "Phường Quán Thánh", "Phường Thành Công", "Phường Trúc Bạch", "Phường Vĩnh Phúc"
            ],
            "Quận Bắc Từ Liêm": ["Phường Cổ Nhuế 1", "Phường Cổ Nhuế 2", "Phường Đông Ngạc", "Phường Đức Thắng",
                "Phường Liên Mạc", "Phường Minh Khai", "Phường Phúc Diễn", "Phường Phú Diễn", "Phường Tây Tựu",
                "Phường Thụy Phương", "Phường Thượng Cát", "Phường Xuân Đỉnh", "Phường Xuân Tảo"
            ],
            "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Mai Dịch", "Phường Nghĩa Đô",
                "Phường Nghĩa Tân", "Phường Quan Hoa", "Phường Trung Hòa", "Phường Yên Hòa"
            ],
            "Quận Đống Đa": ["Phường Cát Linh", "Phường Hàng Bột", "Phường Khâm Thiên", "Phường Khương Thượng",
                "Phường Ô Chợ Dừa", "Phường Phương Liên", "Phường Phương Mai", "Phường Quang Trung", "Phường Quốc Tử Giám",
                "Phường Thịnh Quang", "Phường Thổ Quan", "Phường Trung Liệt", "Phường Trung Phụng", "Phường Trung Tự",
                "Phường Văn Chương", "Phường Văn Miếu"
            ],
            "Quận Hà Đông": ["Phường Biên Giang", "Phường Dương Nội", "Phường Đồng Mai", "Phường Hà Cầu",
                "Phường Kiến Hưng", "Phường La Khê", "Phường Mộ Lao", "Phường Nguyễn Trãi", "Phường Phú La",
                "Phường Phúc La", "Phường Phú Lãm", "Phường Phú Lương", "Phường Quang Trung", "Phường Vạn Phúc",
                "Phường Văn Quán", "Phường Yên Nghĩa", "Phường Yết Kiêu"
            ],
            "Quận Hai Bà Trưng": ["Phường Bạch Đằng", "Phường Bách Khoa", "Phường Bạch Mai", "Phường Bùi Thị Xuân",
                "Phường Cầu Dền", "Phường Đống Mác", "Phường Đồng Nhân", "Phường Đồng Tâm", "Phường Lê Đại Hành",
                "Phường Minh Khai", "Phường Ngô Thì Nhậm", "Phường Nguyễn Du", "Phường Phạm Đình Hổ", "Phường Phố Huế",
                "Phường Quỳnh Lôi", "Phường Quỳnh Mai", "Phường Thanh Lương", "Phường Thanh Nhàn", "Phường Trương Định", "Phường Vĩnh Tuy"
            ],
            "Quận Hoàng Mai": ["Phường Đại Kim", "Phường Định Công", "Phường Giáp Bát", "Phường Hoàng Liệt",
                "Phường Hoàng Văn Thụ", "Phường Lĩnh Nam", "Phường Mai Động", "Phường Tân Mai", "Phường Thanh Trì",
                "Phường Thịnh Liệt", "Phường Trần Phú", "Phường Tương Mai", "Phường Vĩnh Hưng", "Phường Yên Sở"
            ],
            "Quận Hoàn Kiếm": ["Phường Chương Dương", "Phường Cửa Đông", "Phường Cửa Nam", "Phường Đồng Xuân",
                "Phường Hàng Bạc", "Phường Hàng Bài", "Phường Hàng Bồ", "Phường Hàng Bông", "Phường Hàng Buồm",
                "Phường Hàng Đào", "Phường Hàng Gai", "Phường Hàng Mã", "Phường Hàng Trống", "Phường Lý Thái Tổ",
                "Phường Phan Chu Trinh", "Phường Phúc Tân", "Phường Tràng Tiền", "Phường Trần Hưng Đạo"
            ],
            "Quận Long Biên": ["Phường Bồ Đề", "Phường Cự Khối", "Phường Đức Giang", "Phường Giang Biên",
                "Phường Gia Thụy", "Phường Long Biên", "Phường Ngọc Lâm", "Phường Ngọc Thụy", "Phường Phúc Đồng",
                "Phường Phúc Lợi", "Phường Sài Đồng", "Phường Thạch Bàn", "Phường Thượng Thanh", "Phường Việt Hưng"
            ],
            "Quận Nam Từ Liêm": ["Phường Cầu Diễn", "Phường Đại Mỗ", "Phường Mễ Trì", "Phường Mỹ Đình 1",
                "Phường Mỹ Đình 2", "Phường Phú Đô", "Phường Phương Canh", "Phường Tây Mỗ", "Phường Trung Văn",
                "Phường Xuân Phương"
            ],
            "Quận Tây Hồ": ["Phường Bưởi", "Phường Nhật Tân", "Phường Phú Thượng", "Phường Quảng An",
                "Phường Thụy Khuê", "Phường Tứ Liên", "Phường Xuân La", "Phường Yên Phụ"
            ],
            "Quận Thanh Xuân": ["Phường Hạ Đình", "Phường Khương Đình", "Phường Khương Mai", "Phường Khương Trung",
                "Phường Kim Giang", "Phường Nhân Chính", "Phường Phương Liệt", "Phường Thanh Xuân Bắc", "Phường Thanh Xuân Nam",
                "Phường Thanh Xuân Trung", "Phường Thượng Đình"
            ]
        }
        window.onload = function() {
            var huyen = document.getElementById("huyen");
            var xa = document.getElementById("xa");
            for (var qh in info) {
                huyen.options[huyen.options.length] = new Option(qh, qh);
            }
            huyen.onchange = function() {
                xa.length = 1;
                if (this.selectedIndex < 1)
                    return;
                var px = info[this.value];
                for (var i = 0; i < px.length; i++) {
                    xa.options[xa.options.length] = new Option(px[i], px[i]);
                }
            }
        }
        $('#btn-xuongdong').on('click', function() {
            $('#mota-thongtin').val($('#mota-thongtin').val() + '<br>');
        })
        $('#btn-B').on('click', function() {
            $('#mota-thongtin').val($('#mota-thongtin').val() + '<b></b>');
        })
        $('#btn-I').on('click', function() {
            $('#mota-thongtin').val($('#mota-thongtin').val() + '<i></i>');
        })
        $('#btn-U').on('click', function() {
            $('#mota-thongtin').val($('#mota-thongtin').val() + '<u></u>');
        })
        $('#btn-remove').on('click', function() {
            $('#mota-thongtin').val('');
            $('.hien-thi').html('');
        })

        $('#btn-display').on('click', function() {
            $('.hien-thi').html($('#mota-thongtin').val());
        })

        $('#btn-xuongdong-noiquy').on('click', function() {
            $('#mota-noiquy').val($('#mota-noiquy').val() + '<br>');
        })
        $('#btn-B-noiquy').on('click', function() {
            $('#mota-noiquy').val($('#mota-noiquy').val() + '<b></b>');
        })
        $('#btn-I-noiquy').on('click', function() {
            $('#mota-noiquy').val($('#mota-noiquy').val() + '<i></i>');
        })
        $('#btn-U-noiquy').on('click', function() {
            $('#mota-noiquy').val($('#mota-noiquy').val() + '<u></u>');
        })
        $('#btn-remove-noiquy').on('click', function() {
            $('#mota-noiquy').val('');
            $('.hien-thi-noi-quy').html('');
        })



        $('#btn-display-noiquy').on('click', function() {
            $('.hien-thi-noi-quy').html($('#mota-noiquy').val());
        })

    });