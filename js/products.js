$(document).ready(function() {
    const models = {
        howo: {
            "dump-trucks": [
                { img: "images/howo-dump-truck-1.jpg", caption: "HOWO 371 - Dump Truck" },
                { img: "images/howo-dump-truck-2.jpg", caption: "HOWO 336 - Dump Truck" },
                { img: "images/howo-dump-truck-3.jpg", caption: "HOWO 375 - Dump Truck" },
                { img: "images/howo-dump-truck-4.jpg", caption: "HOWO 380 - Dump Truck" },
                { img: "images/howo-dump-truck-5.jpg", caption: "HOWO 400 - Dump Truck" },
                { img: "images/howo-dump-truck-6.jpg", caption: "HOWO 420 - Dump Truck" },
                { img: "images/howo-dump-truck-7.jpg", caption: "HOWO 430 - Dump Truck" },
                { img: "images/howo-dump-truck-8.jpg", caption: "HOWO 440 - Dump Truck" },
                { img: "images/howo-dump-truck-9.jpg", caption: "HOWO 450 - Dump Truck" },
                { img: "images/howo-dump-truck-10.jpg", caption: "HOWO 460 - Dump Truck" },
                { img: "images/howo-dump-truck-11.jpg", caption: "HOWO 470 - Dump Truck" },
                { img: "images/howo-dump-truck-12.jpg", caption: "HOWO 480 - Dump Truck" }
            ],
            "tractor-trucks": [
                { img: "images/howo-tractor-1.jpg", caption: "HOWO A7 - Tractor Truck" },
                { img: "images/howo-tractor-2.jpg", caption: "HOWO T7H - Tractor Truck" },
                { img: "images/howo-tractor-3.jpg", caption: "HOWO 375 - Tractor Truck" },
                { img: "images/howo-tractor-4.jpg", caption: "HOWO 420 - Tractor Truck" },
                { img: "images/howo-tractor-5.jpg", caption: "HOWO 440 - Tractor Truck" },
                { img: "images/howo-tractor-6.jpg", caption: "HOWO 460 - Tractor Truck" },
                { img: "images/howo-tractor-7.jpg", caption: "HOWO 480 - Tractor Truck" },
                { img: "images/howo-tractor-8.jpg", caption: "HOWO 500 - Tractor Truck" },
                { img: "images/howo-tractor-9.jpg", caption: "HOWO 520 - Tractor Truck" },
                { img: "images/howo-tractor-10.jpg", caption: "HOWO 540 - Tractor Truck" },
                { img: "images/howo-tractor-11.jpg", caption: "HOWO 560 - Tractor Truck" },
                { img: "images/howo-tractor-12.jpg", caption: "HOWO 580 - Tractor Truck" }
            ],
            "cargo-trucks": [
                { img: "images/howo-cargo-1.jpg", caption: "HOWO T5G - Cargo Truck" },
                { img: "images/howo-cargo-2.jpg", caption: "HOWO 336 - Cargo Truck" },
                { img: "images/howo-cargo-3.jpg", caption: "HOWO 375 - Cargo Truck" },
                { img: "images/howo-cargo-4.jpg", caption: "HOWO 400 - Cargo Truck" },
                { img: "images/howo-cargo-5.jpg", caption: "HOWO 420 - Cargo Truck" },
                { img: "images/howo-cargo-6.jpg", caption: "HOWO 440 - Cargo Truck" },
                { img: "images/howo-cargo-7.jpg", caption: "HOWO 460 - Cargo Truck" },
                { img: "images/howo-cargo-8.jpg", caption: "HOWO 480 - Cargo Truck" },
                { img: "images/howo-cargo-9.jpg", caption: "HOWO 500 - Cargo Truck" },
                { img: "images/howo-cargo-10.jpg", caption: "HOWO 520 - Cargo Truck" },
                { img: "images/howo-cargo-11.jpg", caption: "HOWO 540 - Cargo Truck" },
                { img: "images/howo-cargo-12.jpg", caption: "HOWO 560 - Cargo Truck" }
            ],
            "cement-mixer-trucks": [
                { img: "images/howo-mixer-1.jpg", caption: "HOWO Mixer 6x4 - Cement Mixer Truck" },
                { img: "images/howo-mixer-2.jpg", caption: "HOWO Mixer 8x4 - Cement Mixer Truck" },
                { img: "images/howo-mixer-3.jpg", caption: "HOWO Mixer 10m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-4.jpg", caption: "HOWO Mixer 12m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-5.jpg", caption: "HOWO Mixer 14m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-6.jpg", caption: "HOWO Mixer 16m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-7.jpg", caption: "HOWO Mixer 18m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-8.jpg", caption: "HOWO Mixer 20m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-9.jpg", caption: "HOWO Mixer 22m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-10.jpg", caption: "HOWO Mixer 24m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-11.jpg", caption: "HOWO Mixer 26m³ - Cement Mixer Truck" },
                { img: "images/howo-mixer-12.jpg", caption: "HOWO Mixer 28m³ - Cement Mixer Truck" }
            ]
        },
        caterpillar: {
            excavator: [
                { img: "images/cat-excavator-1.jpeg", caption: "320D - Excavator" },
                { img: "images/cat-excavator-2.jpeg", caption: "336D - Excavator" },
                { img: "images/cat-excavator-3.jpeg", caption: "349F - Excavator" },
                { img: "images/cat-excavator-4.jpeg", caption: "374F - Excavator" },
                { img: "images/cat-excavator-5.jpeg", caption: "390F - Excavator" },
                { img: "images/cat-excavator-6.jpeg", caption: "305.5E - Excavator" },
                { img: "images/cat-excavator-7.jpeg", caption: "308E - Excavator" },
                { img: "images/cat-excavator-8.jpeg", caption: "312D - Excavator" },
                { img: "images/cat-excavator-9.jpeg", caption: "315D - Excavator" },
                { img: "images/cat-excavator-10.jpeg", caption: "323D - Excavator" },
                { img: "images/cat-excavator-11.jpeg", caption: "329F - Excavator" },
                { img: "images/cat-excavator-12.jpeg", caption: "352F - Excavator" }
            ],
            loader: [
                { img: "images/cat-loader-1.jpeg", caption: "906M - Loader" },
                { img: "images/cat-loader-2.jpeg", caption: "908M - Loader" },
                { img: "images/cat-loader-3.jpeg", caption: "910K - Loader" },
                { img: "images/cat-loader-4.jpeg", caption: "914K - Loader" },
                { img: "images/cat-loader-5.jpeg", caption: "918M - Loader" },
                { img: "images/cat-loader-6.jpeg", caption: "920K - Loader" },
                { img: "images/cat-loader-7.jpeg", caption: "924K - Loader" },
                { img: "images/cat-loader-8.jpeg", caption: "930M - Loader" },
                { img: "images/cat-loader-9.jpeg", caption: "938M - Loader" },
                { img: "images/cat-loader-10.jpeg", caption: "950M - Loader" },
            ],
            dozer: [
                { img: "images/cat-dozer-1.jpeg", caption: "D6R - Dozer" },
                { img: "images/cat-dozer-2.jpeg", caption: "D8T - Dozer" },
                { img: "images/cat-dozer-3.jpeg", caption: "D9R - Dozer" },
                { img: "images/cat-dozer-4.jpeg", caption: "D10T - Dozer" },
                { img: "images/cat-dozer-5.jpeg", caption: "D11T - Dozer" },
                { img: "images/cat-dozer-6.jpeg", caption: "D5K - Dozer" },
                { img: "images/cat-dozer-7.jpeg", caption: "D6N - Dozer" },
                { img: "images/cat-dozer-8.jpeg", caption: "D7E - Dozer" },
                { img: "images/cat-dozer-9.jpeg", caption: "D8R - Dozer" },
                { img: "images/cat-dozer-10.jpeg", caption: "D9T - Dozer" },
                { img: "images/cat-dozer-11.jpeg", caption: "D4K - Dozer" },
                { img: "images/cat-dozer-12.jpeg", caption: "D3K - Dozer" }
            ],
            "wheel-loader": [
                { img: "images/cat-wheel-loader-1.jpeg", caption: "950H - Wheel Loader" },
                { img: "images/cat-wheel-loader-2.jpeg", caption: "980K - Wheel Loader" },
                { img: "images/cat-wheel-loader-3.jpeg", caption: "988K - Wheel Loader" },
                { img: "images/cat-wheel-loader-4.jpeg", caption: "992K - Wheel Loader" },
                { img: "images/cat-wheel-loader-5.jpeg", caption: "994K - Wheel Loader" },
                { img: "images/cat-wheel-loader-6.jpeg", caption: "924H - Wheel Loader" },
                { img: "images/cat-wheel-loader-7.jpeg", caption: "930H - Wheel Loader" },
                { img: "images/cat-wheel-loader-8.jpeg", caption: "938K - Wheel Loader" },
                { img: "images/cat-wheel-loader-9.jpeg", caption: "950M - Wheel Loader" },
                { img: "images/cat-wheel-loader-10.jpeg", caption: "962M - Wheel Loader" },
                { img: "images/cat-wheel-loader-11.jpeg", caption: "966K - Wheel Loader" },
                { img: "images/cat-wheel-loader-12.jpeg", caption: "972M - Wheel Loader" }
            ],
            "truck-loader": [
                { img: "images/cat-truck-loader-1.jpeg", caption: "770G - Truck Loader" },
                { img: "images/cat-truck-loader-2.jpeg", caption: "772G - Truck Loader" },
                { img: "images/cat-truck-loader-3.jpeg", caption: "773G - Truck Loader" },
            ]
        },
        xugong: {
            bulldozer: [
                { img: "images/xugong-bulldozer-1.jpg", caption: "XD143 - Bulldozer" },
                { img: "images/xugong-bulldozer-2.jpg", caption: "XD160 - Bulldozer" },
                { img: "images/xugong-bulldozer-3.jpg", caption: "XD180 - Bulldozer" },
                { img: "images/xugong-bulldozer-4.jpg", caption: "XD200 - Bulldozer" },
                { img: "images/xugong-bulldozer-5.jpg", caption: "XD220 - Bulldozer" },
                { img: "images/xugong-bulldozer-6.jpg", caption: "XD240 - Bulldozer" },
                { img: "images/xugong-bulldozer-7.jpg", caption: "XD260 - Bulldozer" },
                { img: "images/xugong-bulldozer-8.jpg", caption: "XD280 - Bulldozer" },
                { img: "images/xugong-bulldozer-9.jpg", caption: "XD300 - Bulldozer" },
                { img: "images/xugong-bulldozer-10.jpg", caption: "XD320 - Bulldozer" }
            ],
            "road-roller": [
                { img: "images/xugong-road-roller-1.jpg", caption: "XS223J - Road Roller" },
                { img: "images/xugong-road-roller-2.jpg", caption: "XS263J - Road Roller" },
                { img: "images/xugong-road-roller-3.jpg", caption: "XS303 - Road Roller" },
                { img: "images/xugong-road-roller-4.jpg", caption: "XS143J - Road Roller" },
                { img: "images/xugong-road-roller-5.jpg", caption: "XS163J - Road Roller" },
                { img: "images/xugong-road-roller-6.jpg", caption: "XS183J - Road Roller" },
                { img: "images/xugong-road-roller-7.jpg", caption: "XS203J - Road Roller" },
                { img: "images/xugong-road-roller-8.jpg", caption: "XS123 - Road Roller" },
                { img: "images/xugong-road-roller-9.jpg", caption: "XS143 - Road Roller" },
                { img: "images/xugong-road-roller-10.jpg", caption: "XS163 - Road Roller" },
            ],
            "grader-machine": [
                { img: "images/xugong-grader-1.jpg", caption: "GR215 - Grader Machine" },
                { img: "images/xugong-grader-2.jpg", caption: "GR180 - Grader Machine" },
                { img: "images/xugong-grader-3.jpg", caption: "GR165 - Grader Machine" },
                { img: "images/xugong-grader-4.jpg", caption: "GR135 - Grader Machine" },
                { img: "images/xugong-grader-5.jpg", caption: "GR300 - Grader Machine" },
                { img: "images/xugong-grader-6.jpg", caption: "GR260 - Grader Machine" },
                { img: "images/xugong-grader-7.jpg", caption: "GR240 - Grader Machine" },
                { img: "images/xugong-grader-8.jpg", caption: "GR200 - Grader Machine" },
                { img: "images/xugong-grader-9.jpg", caption: "GR230 - Grader Machine" },
                { img: "images/xugong-grader-10.jpg", caption: "GR160 - Grader Machine" },
                { img: "images/xugong-grader-11.jpg", caption: "GR190 - Grader Machine" },
                { img: "images/xugong-grader-12.jpg", caption: "GR220 - Grader Machine" }
            ],
            "truck-lifting-machines": [
                { img: "images/xugong-truck-lift-1.jpg", caption: "QY25K - Truck Lifting Machine" },
                { img: "images/xugong-truck-lift-2.jpg", caption: "QY50KA - Truck Lifting Machine" },
                { img: "images/xugong-truck-lift-3.jpg", caption: "QY70K - Truck Lifting Machine" },
            ]
        }
    };

    $('.subgroups a').click(function(e) {
        e.preventDefault();
        
        // Remove .active from all subgroup links
        $('.subgroups a').removeClass('active');
        
        // Add .active to the clicked link
        $(this).addClass('active');
        
        // Load the images for the selected subgroup
        const group = $(this).data('group');
        const subgroup = $(this).data('subgroup');
        const modelData = models[group][subgroup];
        
        let html = '';
        modelData.forEach(model => {
            html += `
                <div class="col-md-4">
                    <div class="product_box">
                        <figure><img src="${model.img}" alt="${model.caption}"></figure>
                        <h3>${model.caption}</h3>
                    </div>
                </div>
            `;
        });
        
        $('#model-display').html(html);
    });
});