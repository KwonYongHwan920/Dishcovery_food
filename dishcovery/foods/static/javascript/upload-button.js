$(document).ready(function () {
    $(".check").click(function (e) {
        e.preventDefault(); // 클릭 동작을 막습니다.
    });
    $("#upload-button a").click(function (e) {
        e.preventDefault(); // a 태그의 기본 동작을 막습니다.

        // 'Upload Now' 버튼을 클릭하면, 숨겨진 file input의 클릭 이벤트를 트리거합니다.
        $("#file-input").click();
    });

    // 파일을 선택하면, 애니메이션을 실행하고 form을 제출합니다.
    $("#file-input").change(function () {
        var btn = $("#upload-button");
        var loadSVG = btn.find(".load");
        var loadBar = btn.find("div").children("span");
        var checkSVG = btn.find(".check");
        var spanElement = btn.find("span");
        var form = $(this).closest("form"); // 현재 버튼이 속한 form을 찾습니다.

        btn.children("a").children("span").fadeOut(200, function () {
            btn.children("a").animate({
                width: 56
            }, 100, function () {
                loadSVG.fadeIn(300);
                btn.animate({
                    width: 320
                }, 200, function () {
                    btn.children("div").fadeIn(200, function () {
                        loadBar.animate({
                            width: "100%"
                        }, 2000, function () {
                            loadSVG.fadeOut(200, function () {
                                checkSVG.fadeIn(200, function () {
                                    setTimeout(function () {
                                        btn.children("div").fadeOut(200, function () {
                                            loadBar.width(0);
                                            checkSVG.fadeOut(200, function () {
                                                btn.children("a").animate({
                                                    width: 150
                                                });
                                                btn.animate({
                                                    width: 150
                                                }, 300, function () {
                                                    btn.children("a").children("span").fadeIn(200);
                                                });
                                            });
                                        });
                                    }, 2000);
                                });
                            });
                        });
                    });
                });
            });
        });
        form.submit();
    });
});