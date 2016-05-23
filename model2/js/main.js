window.onload = function() {
    var numberStage,
        numberStageCtx,
        numberStageWidth = 680,
        numberStageHeight = 420,
        numberOffsetX,
        numberOffsetY,

        stage,
        stageCtx,
        stageWidth = window.innerWidth,
        stageHeight = window.innerHeight,
        stageCenterX = stageWidth / 2,
        stageCenterY = stageHeight / 2,

        countdownFrom = 10,//倒计时时间
        countdownTimer = 500,//创建和break时间
        countdownRunning = true,//倒计时状态

        number,
        dots = [],
        numberPixelCoordinates,
        circleRadius = 2,
        colors = ['128, 128, 128', '255, 244, 174', '255, 211, 218', '220, 220, 220'];

    function init() {

        // 初始化number
        numberStage = document.getElementById("canvas-number");
        numberStageCtx = numberStage.getContext('2d');
        // 设置画布的宽度和高度
        numberStage.width = numberStageWidth;
        numberStage.height = numberStageHeight;

        // 初始化点
        stage = document.getElementById("canvas-dots");
        stageCtx = stage.getContext('2d');
        stage.width = stageWidth;
        stage.height = stageHeight;

        //创建偏移，所以文本出现在屏幕中间
        numberOffsetX = (stageWidth - numberStageWidth) / 2;
        numberOffsetY = (stageHeight - numberStageHeight) / 2;
    }

    init();

    // 点对象
    function Dot(x, y, color, alpha) {

        var _this = this;

        _this.x = x;
        _this.y = y;
        _this.color = color;
        _this.alpha = alpha;

        this.draw = function() {
            stageCtx.beginPath();
            stageCtx.arc(_this.x, _this.y, circleRadius, 0, 2 * Math.PI, false);
            stageCtx.fillStyle = 'rgba(' + _this.color + ', ' + _this.alpha + ')';
            stageCtx.fill();
        }

    }

    // 创造一定数量的点
    for (var i = 0; i < 3240; i++) {

        // 创建一个点
        var dot = new Dot(randomNumber(0, stageWidth), randomNumber(0, stageHeight), colors[randomNumber(1, colors.length)], .3);

        // Push到点的数组
        dots.push(dot);

        // 点动画
        tweenDots(dot, '', 'space');
    }


    // 倒计时开始
    function countdown() {

        // 绘制number


            drawNumber(countdownFrom.toString());
            countdownFrom--;

        // 减少数量

    }
    countdown();


    // 重绘环
    function loop() {

        stageCtx.clearRect(0, 0, stageWidth, stageHeight);

        for (var i = 0; i < dots.length; i++) {
            dots[i].draw(stageCtx);
        }

        requestAnimationFrame(loop);
    }

    loop();

    // 绘制number
    function drawNumber(num) {

        // 创建一个单独的画布上的number
        // 使用一个单独的画布更小，更少的数据循环使用getimagedata()
        //  清除前一个数字
        numberStageCtx.clearRect(0, 0, numberStageWidth, numberStageHeight);

        numberStageCtx.fillStyle = "#24282f";
        numberStageCtx.textAlign = 'center';
        numberStageCtx.font = "bold 418px Lato";
        numberStageCtx.fillText(num, 340, 400);

        var ctx = document.getElementById('canvas-number').getContext('2d');

        // getimagedata（x，y，宽度，高度）
        // 注：是一个exspenisve功能，所以确保画布是尽可能小
        //返回的像素颜色值个1维数组
        // 红，蓝，绿，单像素单位
        var imageData = ctx.getImageData(0, 0, numberStageWidth, numberStageHeight).data;

        // 明确number
        numberPixelCoordinates = [];

        //总图像数据（例如：480000）
        //大于等于0时运行
        //我们的每一次运行它减去4从我这样做是因为每个像素有4个与我们只在个别像素感兴趣 
        for (var i = imageData.length; i >= 0; i -= 4) {

            // 如果不是空像素
            if (imageData[i] !== 0) {

                // i代表在数组中的位置，一个红色的像素

                //（i/ 4）按宽度百分比
                // 然后，需要按宽度百分比（600），因为每行包含600个像素，并且你需要它的相对位置
                var x = (i / 4) % numberStageWidth;

                // （i除以宽度）然后除以4
                // 除以宽度（600）首先让你得到的行的像素组成的画布。然后除以4行内得到它的位置
                var y = Math.floor(Math.floor(i / numberStageWidth) / 4);

                // 如果存在的位置和数量divisble圈加上一个像素的差距然后添加坐标数组。所以圆不重叠
                if ((x && x % (circleRadius * 2 + 3) == 0) && (y && y % (circleRadius * 2 + 3) == 0)) {
                    // 将对象的X和Y坐标numberpixels阵列
                    numberPixelCoordinates.push({
                        x: x,
                        y: y
                    });

                }

            }
        }

        formNumber();

    }


    //number形式
    function formNumber() {

        for (var i = 0; i < numberPixelCoordinates.length; i++) {

            // 点动画
            tweenDots(dots[i], numberPixelCoordinates[i], '');
        }

        // number分开
        if (countdownRunning && countdownFrom > 0) {
            setTimeout(function() {
                breakNumber();
            }, countdownTimer);
        }
    }

    function breakNumber() {

        for (var i = 0; i < numberPixelCoordinates.length; i++) {
            tweenDots(dots[i], '', 'space');
        }

        if (countdownRunning ) {
            // 创建下一个number
            if (countdownFrom===0) {//此处判断是否倒计时到0，进行下一步操作
                countdownRunning = false;
                drawNumber('GO');
               window.setTimeout("window.location='index.html'",1000);
           }
               else{
                setTimeout(function() {
                    countdown();
                }, countdownTimer);
            }
        }
    }
    // 点动画
    function tweenDots(dot, pos, type) {

        // 在画布上随机移动点
        if (type === 'space') {

            // 点之间的坐标，以形成数字
            TweenMax.to(dot, 1, {
                x: randomNumber(0, stageWidth),
                y: randomNumber(0, stageHeight),
                alpha: 0,//背景粒子的透明度
                ease: Cubic.easeInOut,
                onComplete: function() {
                    tweenDots(dot, '', 'space');
                }
            });

        } else {

            //点之间的坐标，以形成数字
            TweenMax.to(dot,0.5, {
                x: (pos.x + numberOffsetX),
                y: (pos.y + numberOffsetY),
                delay: 0,//延迟动画，以秒为单位
                alpha: 1,//中间倒计时数字的透明度
                ease: Cubic.easeInOut,
                onComplete: function() {}
            });

        }
    }


    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
};
