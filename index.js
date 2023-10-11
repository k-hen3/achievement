let formCount = 1;
console.log(`現在のフォームの数：${formCount}`);

$(".add").click(function(){
    ++formCount;
    console.log("現在のフォームの数：" + formCount);

    let newForm = $(".input_container1").prop('outerHTML');
    newForm = newForm.replace(/1/g, formCount);
    $(".input_section").append(newForm);
});

$(".watch").click(function(){
    // console.log("pushed");
    $('.todo_name').empty();
    $('.rate_result').empty();
    $('.all_result').empty();

    const inputContainer = $("[class^='input_container']");
    const inputContainerCount = inputContainer.length;
    // console.log('要素の数：' + inputContainerCount);

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
    console.log(`全体の達成率：${achievementRate}`);

    $('.all_result').append(`全体の達成率：${achievementRate} %`);
    
    // グラフ作成
    let context = $('.chart');
    new Chart(context, {
        type: 'doughnut',
        // type: 'pie',
        data: {
            // labels: ["サーモン", "ハマチ", "マグロ", "エンガワ"],
            labels: todos,
            datasets: [{
                backgroundColor: ["#fa8072", "#00ff7f", "#00bfff", "#f5f5f5"],
                // data: [60, 20, 15, 5]
                data: rates
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
    // todo:円グラフの色を変える
    // todo:100% - 全体の達成率 ＝　x , xをrates配列に加えてnewArrayを作成、 newArrayを円グラフとして表示する
});
