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
    $('.result').empty();


    const inputContainer = $("[class^='input_container']");
    const inputContainerCount = inputContainer.length;
    // console.log('要素の数：' + inputContainerCount);

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
        // $('.result').append('<div>' + todoVal + '</div>');
        $('.result').append(`<div>todo${i} : ${todoVal}</div>`);
        $('.result').append(`<div>rate : ${rateVal} %</div>`);


        console.log('==============');

    }
    
    // todo:値が入っていないときのバリデーション
    // todo:フォームの数を減らすボタン

});
