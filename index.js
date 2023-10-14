let formCount = 1;
console.log(`現在のフォームの数：${formCount}`);
let doughnutChart = null;

$(".add").click(function(){
    ++formCount;
    console.log("現在のフォームの数：" + formCount);

    let newForm = $(".input_container1").prop('outerHTML');
    newForm = newForm.replace(/1/g, formCount);
    $(".input_section").append(newForm);
});

$(".watch").click(function(){
    // console.log("pushed");

    // 既存のものを一旦削除
    $('.todo_name').empty();
    $('.rate_result').empty();
    $('.all_result').empty();
    if(doughnutChart){
        doughnutChart.destroy();
    }

    const inputContainer = $("[class^='input_container']");
    const inputContainerCount = inputContainer.length;

    let rates = [];
    let todos = [];
    let todoObj = {};

    // １つずつフォームのhtml構造を取り出す
    console.log('==============');
    for (let i = 1; i <= inputContainerCount; i++) {
        
        // console.log(i);
        const todoId = `#todo${i}`;
        const rateId = `#rate${i}`;
        // console.log(todoId);

        const todoVal = $(todoId).val();
        const rateVal = $(rateId).val();
        console.log('task number' + i + ' : ' + todoVal);
        console.log('rate number' + i + ' : ' + rateVal);

        // 画面出力
        $('.individual_result').append(`<div class="todo_name">todo${i} : ${todoVal}</div>`);
        $('.individual_result').append(`<div class="rate_result">rate : ${rateVal} %</div>`);

        console.log('==============');

        // それぞれの達成率をまとめる
        rates.push(rateVal);
        // それぞれのtodoをまとめる
        todos.push(todoVal);
        // オブジェクトにまとめる
        todoObj[todoVal] = rateVal;
    }

    console.log(`todos：${todos}`);
    console.log(todoObj);

    // 全体の目標達成率
    console.log(`全体の達成率、配列：${rates}`);
    achievementRate = rates.reduce((achievementRate, rates) => achievementRate + parseInt(rates), 0);

    achievementRate = achievementRate / formCount;
    achievementRate = Math.round(achievementRate);
    console.log(`全体の達成率：${achievementRate}`);

    $('.all_result').append(`全体の達成率：${achievementRate} %`);
    
    // グラフ用の達成率を入れる配列を作成
    let doughnutRates = [];
    
    rates.forEach(rate => {
        // rates配列の中身を１つずつformCountで割る
        let doughnutRate = rate / formCount;
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
    console.log(`フォームカウント：${formCount}`);
    for (let i = 0; i < formCount; i++) {
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
    
    // // 帯グラフで出力する
    // let chartBar = $('.chart_bar');


    // 入力フォーム関係
    // todo:stepの１も置換されている、一旦消してもいいかも
    // todo:値が入っていないときのバリデーション
    // todo:フォームの数を減らすボタン
    // todo:input_container1の1いらないかも

    // グラフ関係
    // todo:グラフの見た目を山みたいにして、頂上を達成にする
    // todo:個々の達成率を帯グラフで％、CSSで
});
