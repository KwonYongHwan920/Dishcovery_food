// full screen Search bar animation

$(".search-btn").click(function () {
    $(".wrapper").addClass("active");
    $(this).css("display", "none");
    $(".search-data").fadeIn(500);
    $(".close-btn").fadeIn(500);
    $(".search-data .line").addClass("active");
    setTimeout(function () {
        $("input").focus();
        $(".search-data label").fadeIn(500);
        $(".search-data span").fadeIn(500);
    }, 800);
});
$(".close-btn").click(function () {
    $(".wrapper").removeClass("active");
    $(".search-btn").fadeIn(800);
    $(".search-data").fadeOut(500);
    $(".close-btn").fadeOut(500);
    $(".search-data .line").removeClass("active");
    $("input").val("");
    $(".search-data label").fadeOut(500);
    $(".search-data span").fadeOut(500);
});

//챗봇

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    const classes = className.split(' ');
    chatLi.classList.add("chat", ...classes);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}


const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("...", "incoming");

    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // AJAX Request
    $.ajax({
        url: '/chatbot/assistance/',  // 요청을 보낼 URL입니다.
        type: 'GET',
        data: {
            'user_input': userMessage
        },
        success: function (data) {
            if (data.message === 'SUCCESS') {
                incomingChatLi.querySelector("p").textContent = data.result;
            }
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

/*-------------------------------------------------------------*/


$(document).ready(function () {

    $("#tagSelect").change(function () {
        console.log($(this).val()); // 추가된 코드
        if ($(this).val() == 'image') {
            if ($("#meal-list").length != 0) {
                $("#meal-list").empty();
            }
            var uploadButton = document.getElementById('upload-button');
            if (uploadButton != null) {
                console.log(uploadButton);
                uploadButton.style.display = 'block';
            }
        }
        else {
            var uploadButton = document.getElementById('upload-button');
            if (uploadButton != null) {
                uploadButton.style.display = 'none';
            }
        }
    });

});


$("#searchInput").keypress(function (e) {
    //검색어 입력 후 엔터키 입력하면 조회버튼 클릭
    if (e.keyCode && e.keyCode == 13) {
        $("#searchButton").trigger("click");
        return false;
    }
    //엔터키 막기
    if (e.keyCode && e.keyCode == 13) {
        e.preventDefault();
    }
});

$("#searchButton").click(function () {
    var keyword = $("#searchInput").val();
    var tag = $("#tagSelect").val();
    $.ajax({
        url: '/recipe/',
        type: 'GET',
        data: {
            'keyword': keyword,
            'tag': tag
        },
        success: function (data) {
            console.log(data);
            var recipeList = '';
            for (var i = 0; i < data.row.length; i++) {
                recipeList += '<div class="meal-item" data-seq= "' + data.row[i].seq + '" >';
                recipeList += '<img src="' + data.row[i].image + '" alt="' + data.row[i].name + '">';
                recipeList += '<h3>' + data.row[i].name + '</h3></div>';
            }
            $('#meal-list').html(recipeList);
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
});

// 클릭 이벤트 추가
$(document).on('click', '.meal-item', function () {
    var seq = $(this).data('seq');
    $.ajax({
        url: '/recipe/detail/',
        type: 'GET',
        data: {
            'keyword': $("#searchInput").val(),
            'seq': seq
        },
        success: function (data) {
            // 모달 내용 갱신
            console.log(data);
            var content = '<img class = modal-item src="' + data.음식사진 + '" alt="' + data.메뉴명 + '">';
            content += "<h1>" + data.메뉴명 + "</h1>";
            content += "<h2>영양성분</h2>";

            // 영양성분 데이터를 나열
            for (var i = 0; i < data.영양성분.length; i++) {
                content += "<p>열량 : " + data.영양성분[i].열량 + "</p>";
                content += "<p>탄수화물 : " + data.영양성분[i].탄수화물 + "</p>";
                content += "<p>단백질 : " + data.영양성분[i].단백질 + "</p>";
                content += "<p>지방 : " + data.영양성분[i].지방 + "</p>";
                content += "<p>나트륨 : " + data.영양성분[i].나트륨 + "</p>";
            }

            content += "<h2>레시피</h2>";
            console.log(data.레시피.length);
            // 레시피 이미지를 추가
            // front-end
            // front-end
            for (var i = 0; i < data.레시피.length; i++) {
                var recipeStep = data.레시피[i];
                for (var key in recipeStep) {
                    if (recipeStep.hasOwnProperty(key)) {
                        var recipeContent = recipeStep[key].content ? recipeStep[key].content : '';
                        var recipeImageUrl = recipeStep[key].image ? recipeStep[key].image : '';
                        content += "<p>" + recipeContent + "</p>";
                        if (recipeImageUrl) {
                            content += '<img src="' + recipeImageUrl + '" alt="Recipe Step ' + (i) + '">';
                        }
                    }
                }
            }

            $("#modal-container .meal-details-content").html(content);

            // 모달 표시
            $("#modal-container").show();
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
});
$(document).on('click', '.close-button', function () {
    // 모달 닫기
    $("#modal-container").hide();
});

$('form').on('submit', function (e) {
    e.preventDefault();  // 기본 submit 동작을 방지합니다.

    var formData = new FormData();
    formData.append('image', $('input[type=file]')[0].files[0]);  // 이미지 파일을 FormData에 추가합니다.

    $.ajax({
        url: '/classify_image/',  // 요청을 보낼 URL입니다.
        type: 'POST',
        data: formData,
        processData: false,  // 이 옵션을 false로 설정해야 FormData를 제대로 전송할 수 있습니다.
        contentType: false,  // 이 옵션을 false로 설정해야 FormData를 제대로 전송할 수 있습니다.
        success: function (data) {
            console.log(data);
            var foodList = '';
            for (var i = 0; i < data.row.length; i++) {
                foodList += '<div class="meal-item" data-seq= "' + data.row[i].seq + '" >';
                foodList += '<img src="' + data.row[i].image + '" alt="' + data.row[i].name + '">';
                foodList += '<h3>' + data.row[i].name + '</h3></div>';
            }
            $('#meal-list').html(foodList);
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
});
$.ajax({
    url: '/recipe/detail/',
    type: 'GET',
    data: {
        'seq': seq
    },
    success: function (data) {
        // 모달 내용 갱신
        console.log(data);
        var content = '<img class = modal-item src="' + data.음식사진 + '" alt="' + data.메뉴명 + '">';
        content += "<h1>" + data.메뉴명 + "</h1>";
        content += "<h2>영양성분</h2>";

        // 영양성분 데이터를 나열
        for (var i = 0; i < data.영양성분.length; i++) {
            content += "<p>열량 : " + data.영양성분[i].열량 + "</p>";
            content += "<p>탄수화물 : " + data.영양성분[i].탄수화물 + "</p>";
            content += "<p>단백질 : " + data.영양성분[i].단백질 + "</p>";
            content += "<p>지방 : " + data.영양성분[i].지방 + "</p>";
            content += "<p>나트륨 : " + data.영양성분[i].나트륨 + "</p>";
        }

        content += "<h2>레시피</h2>";
        console.log(data.레시피.length);
        // 레시피 이미지를 추가
        // front-end
        // front-end
        for (var i = 0; i < data.레시피.length; i++) {
            var recipeStep = data.레시피[i];
            for (var key in recipeStep) {
                if (recipeStep.hasOwnProperty(key)) {
                    var recipeContent = recipeStep[key].content ? recipeStep[key].content : '';
                    var recipeImageUrl = recipeStep[key].image ? recipeStep[key].image : '';
                    content += "<p>" + recipeContent + "</p>";
                    if (recipeImageUrl) {
                        content += '<img src="' + recipeImageUrl + '" alt="Recipe Step ' + (i) + '">';
                    }
                }
            }
        }

        $("#modal-container .meal-details-content").html(content);

        // 모달 표시
        $("#modal-container").show();
    },
    error: function (request, status, error) {
        console.log('Error fetching data:', error);
    }
});
$(document).on('click', '.close-button', function () {
    // 모달 닫기
    $("#modal-container").hide();
});

//chatbot

$('#searchButton12').click(function () {
    var user_input = $('#searchInput12').val();  // 사용자 입력값을 가져옵니다.
    $.ajax({
        url: '/chatbot/',  // 요청을 보낼 URL입니다.
        type: 'GET',
        data: {
            'user_input': user_input
        },
        success: function (data) {
            console.log(data);
            if (data.message === 'SUCCESS') {
                $('#modal-container .meal-details-content').text(data.result);
                $('#modal-container').show();
            }
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
});

$('#modalButton').click(function () {
    var userInput = $('#modalInput').val();
    $.ajax({
        url: '/chatbot/assistance/',  // 요청을 보낼 URL입니다.
        type: 'GET',
        data: {
            'user_input': userInput
        },
        success: function (data) {
            console.log(data);
            if (data.message === 'SUCCESS') {
                $('#modal-container .meal-details-content').text(data.result);
            }
        },
        error: function (request, status, error) {
            console.log('Error fetching data:', error);
        }
    });
});

