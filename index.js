// $(document).ready(function() {

    // 初期化
    let formCount = 1;
    // console.log(`現在のフォームカウント：${formCount}`);
    let doughnutChart = null;
    let individualChart = null;

    // フォーム初期化
    let newForm = '<div class="input_container" id="input_container' + formCount + '">';
    newForm += '<div class="text_form_container">';
    newForm += '<label for="todo' + formCount + '">todo' + formCount + '：</label>';
    newForm += '<input type="text" id="todo' + formCount + '" name="todo' + formCount + '" placeholder="例)1時間勉強する">';
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
        newForm += '<input type="text" id="todo' + formCount + '" name="todo' + formCount + '" placeholder="例)1時間勉強する">';
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

        // 既存のものを一旦削除
        $('.individual_container').empty();
        $('.all_result').empty();
        if(doughnutChart){
            doughnutChart.destroy();
        }
        if(individualChart){
            individualChart.destroy();
        }

        let formValid = true;
        let todos = [];
        let todoIds = [];
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
            $(".input_container input[type='text']").each(function() {
                todos.push($(this).val());
            });

            $(".input_container input[type='text']").each(function() {
                todoIds.push($(this).attr('id'));
            });
            
            $(".input_container input[type='number']").each(function() {
                rates.push($(this).val());
            });
            
            $(".validationMessage").empty();
        } else {
            $(".all_result").empty();
            $(".validationMessage").html("全て入力してください");
        }

        // 全体の目標達成率
        achievementRate = rates.reduce((achievementRate, rates) => achievementRate + parseInt(rates), 0);
        achievementRate = achievementRate / todos.length;
        achievementRate = Math.round(achievementRate);

        if(achievementRate){
            $('.all_result').append(`全体の達成率：${achievementRate} %`);
        } else {
            $('.all_result').append("<div>すべて入力したら結果が見れます</div>");
        }

        // １つずつフォームのhtml構造を取り出す
        for (let i = 0; i < todos.length; i++) {
        
            const todoId = todoIds[i];
            const todoVal = todos[i];
            const rateVal = rates[i];

            // 画面出力
            $('.individual_container').append(`<div class="todo_name">${todoId} : ${todoVal}</div>`);
            $('.individual_container').append(`<div class="rate_result">rate : ${rateVal} %</div>`);

            // console.log('==============');

        }

        // 円グラフ用の達成率を入れる配列を作成
        let doughnutRates = [];
        rates.forEach(rate => {
            let doughnutRate = rate / todos.length;
            doughnutRate = Math.round(doughnutRate);

            // 新しい配列に入れる
            doughnutRates.push(doughnutRate);
        });

        // 未達率を追加
        const unachieveRate = 100 - achievementRate;
        doughnutRates.push(unachieveRate);
        let doughnutTodos = todos.slice();
        doughnutTodos.push('未達率');

        // 円グラフの色を作成   
        let colorCodeArray = [];
        for (let i = 0; i < todos.length; i++) {
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

        // グラフ作成
        if (formValid) {
            // 円グラフ作成
            let data = {
                    // labels: ["サーモン", "ハマチ", "マグロ", "エンガワ"],
                    labels: doughnutTodos,
                    datasets: [{
                        // backgroundColor: ["#fa8072", "#00ff7f", "#00bfff", "#a9a9a9"],
                        backgroundColor: colorCodeArray,
                        // data: [60, 20, 15, 5]
                        data: doughnutRates
                    }]
                };

            let options = {
                    cutout: '30%',
                    responsive: false
                };

            let doughnutContext = $('.doughnut_chart');
            doughnutChart = new Chart(doughnutContext, {
                type: 'doughnut',
                data: data,
                options: options,
            });

            // 個々のグラフ作成
            let individualContext = $('.individual_chart');
            // 個々のグラフのための達成率配列の作成
            let individualRates = rates.slice();
            individualRates.push('100');
            
            individualChart = new Chart(individualContext, {
                type: 'bar',
                data: {
                    labels: todos,
                    datasets: [{
                        // label: ['label'],
                        data: individualRates,
                        backgroundColor: colorCodeArray
                    }],
                },
                options: {
                    indexAxis: 'y', // Y軸を使用して水平バーグラフを有効にする
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false, // 凡例を非表示にする
                        }
                    }
                }
            });
        };

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


    // =======Task=========
    // 入力フォーム関係

    // グラフ関係
    // todo:グラフの見た目を山みたいにして、頂上を達成にする？