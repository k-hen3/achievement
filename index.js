// $(document).ready(function() {

    // 初期化
    let formCount = 1;
    // console.log(`現在のフォームカウント：${formCount}`);
    let doughnutChart = null;

    // フォーム初期化
    let newForm = '<div class="input_container" id="input_container' + formCount + '">';
    newForm += '<div class="text_form_container">';
    newForm += '<label for="todo' + formCount + '">todo' + formCount + '：</label>';
    newForm += '<input type="text" id="todo' + formCount + '" name="todo' + formCount + '" placeholder="例)５時間勉強する">';
    newForm += '</div>';
    newForm += '<div class="rate_form_container">';
    newForm += '<label for="rate' + formCount + '">達成率：</label>';
    newForm += '<input type="number" id="rate' + formCount + '" name="todo' + formCount + '" min="0" max="100" placeholder="例)50"> %';
    newForm += '</div>';
    newForm += '<div class="remove_form_container">';
    newForm += '<button class="remove">削除</button>';
    newForm += '</div>';
    newForm += '</div>';    
    $(".input_section").append(newForm);

    // フォーム追加
    function addForm(){
        ++formCount;
        // console.log("現在のフォームカウント：" + formCount);

        newForm = '<div class="input_container" id="input_container' + formCount + '">';
        newForm += '<div class="text_form_container">';
        newForm += '<label for="todo' + formCount + '">todo' + formCount + '：</label>';
        newForm += '<input type="text" id="todo' + formCount + '" name="todo' + formCount + '" placeholder="例)５時間勉強する">';
        newForm += '</div>';
        newForm += '<div class="rate_form_container">';
        newForm += '<label for="rate' + formCount + '">達成率：</label>';
        newForm += '<input type="number" id="rate' + formCount + '" name="todo' + formCount + '" min="0" max="100" placeholder="例)50"> %';
        newForm += '</div>';
        newForm += '<div class="remove_form_container">';
        newForm += '<button class="remove">削除</button>';
        newForm += '</div>';
        newForm += '</div>';

        $(".input_section").append(newForm);
        
    };

    // 各フォームごとの削除
    $(".input_section").on("click", ".remove", function() {
        // --formCount;
        $(this).closest($("[class^='input_container']")).remove();
    });

    // 達成度表示
    function displayResult(){
        // console.log("pushed");

        let formValid = true;
        let todos = [];
        let rates = [];

        // バリデーションエラー
        $(".input_container input").each(function() {
            if ($(this).val() === "") {
                formValid = false;
                return false; // バリデーションエラー
            }
        });

        // todoと達成率を配列にまとめる
        if (formValid) {
            // console.log('true');
            $(".input_container input[type='text']").each(function() {
                todos.push($(this).val());
            });
            
            $(".input_container input[type='number']").each(function() {
                rates.push($(this).val());
            });
            
            $(".validationMessage").empty();
        } else {
            // console.log('false');
            $(".all_result").empty();
            $(".validationMessage").html("全て入力してください");
        }


        // 既存のものを一旦削除
        $('.all_result').empty();
        if(doughnutChart){
            doughnutChart.destroy();
        }


        // 全体の目標達成率
        // console.log(`全体の達成率、配列：${rates}`);
        achievementRate = rates.reduce((achievementRate, rates) => achievementRate + parseInt(rates), 0);

        // console.log(`タスクの数：${todos.length}`);
        achievementRate = achievementRate / todos.length;
        // console.log(`フォームカウント：${formCount}`);
        achievementRate = Math.round(achievementRate);
        console.log(`全体の達成率：${achievementRate}`);

        if(achievementRate){
            $('.all_result').append(`全体の達成率：${achievementRate} %`);
        } else {
            $('.all_result').append("<div>すべて入力したら結果が見れます</div>");
        }
        
        // グラフ用の達成率を入れる配列を作成
        let doughnutRates = [];
        
        rates.forEach(rate => {
            // rates配列の中身を１つずつformCountで割る
            let doughnutRate = rate / todos.length;
            doughnutRate = Math.round(doughnutRate);
            console.log(doughnutRate);
            // 新しい配列に入れる
            doughnutRates.push(doughnutRate);
        });
        console.log(doughnutRates);
        
        // 未達率
        const unachieveRate = 100 - achievementRate;
        console.log(`未達率：${unachieveRate}`);
        todos.push('未達率');
        doughnutRates.push(unachieveRate);

        // 円グラフの色を作成
        let colorCodeArray = [];
        for (let i = 0; i < (todos.length - 1); i++) {
            let randomColorCode;
            // ランダムにカラーコードを生成。#a9a9a9になったらもう一度
            do {
                let colorCode = Math.floor(Math.random() * 16777215).toString(16);
                for (let count = colorCode.length; count < 6; count++) {
                    colorCode = "0" + colorCode;
                }
                randomColorCode = "#" + colorCode;
            } while (randomColorCode === "#a9a9a9");
        
            colorCodeArray.push(randomColorCode)
        }
        colorCodeArray.push('#a9a9a9');
        console.log(`カラーコード:${colorCodeArray}`);

        // グラフ作成
        if (formValid) {
            let context = $('.chart');
            doughnutChart = new Chart(context, {
                type: 'doughnut',
                data: {
                    // labels: ["サーモン", "ハマチ", "マグロ", "エンガワ"],
                    labels: todos,
                    datasets: [{
                        // backgroundColor: ["#fa8072", "#00ff7f", "#00bfff", "#a9a9a9"],
                        backgroundColor: colorCodeArray,
                        // data: [60, 20, 15, 5]
                        data: doughnutRates
                    }]
                },
                options: {
                    responsive: false
                }
            });    
        }
        
        // // // 帯グラフで出力する
        // // let chartBar = $('.chart_bar');
    };
    
    // "フォームを追加"ボタンのクリックイベント
    $(".add").click(function() {
        addForm();
    });

    // "内容を表示"ボタンのクリックイベント
    $(".resultButton").click(function() {
        displayResult();
    });
    
// });



    // 入力フォーム関係
    // todo:値が入っていないときのバリデーション
    // todo:フォームの数を減らすボタン
    // todo:input_container1の1いらないかも

    // グラフ関係
    // todo:グラフの見た目を山みたいにして、頂上を達成にする
    // todo:個々の達成率を帯グラフで％、CSSで