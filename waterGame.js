//레벨설정
//maxCount :  병 갯수
//colorCount: 물 색깔 종류
//emptyCount: 빈병
const allData = [
    {maxCount : 3 , colorCount : 2, emptyCount : 1},
    {maxCount : 5 , colorCount : 3, emptyCount : 2},
    {maxCount : 7 , colorCount : 4, emptyCount : 3},
]


//물병 내 물 색깔
const colorList = ['#404258','#FFACC7','#FAF7F0','#E6E5A3','#D2001A'];

let allDataIndex = 0;
const dcText = document.querySelector('.dc-text');
const dcMain = document.querySelector('.dc-main');

//다음레벨 초기화
const onNext = (index) =>{
    if (index < 0 ) {
        alert ("이전 게임이 없습니다.");
    }
    else if (index >= allData.length){
        alert ("다음 게임이 없습니다.");
    }
    dcText.innerHTML = `${index + 1}/${allData.length}`;
    allDataIndex = index;
    renderHtml(allData[allDataIndex]);
}

//물병 위치, 물 css 렌더링 
const renderHtml = (rule) => {
    
    //
    dcMain.innerHTML = `<div class="bar" style="display:none"></div>
    ${
        Array.from(new Array(rule.maxCount)).map((v,i) =>{
            const haveColorIndex = rule.maxCount  - rule.emptyCount;
            const arr = colorList.slice(0, rule.colorCount).sort(v => Math.random()-0.5);
            let colors = [];
            if(i<haveColorIndex){
                colors = arr.map(v=>({height: 100 / rule.colorCount + '%', color:v}))
            }
            return `<div class="water-ls">
                        <div class = "water-item" onclick="onClick(${i})" id = "m${i}">
                            <div class = "water-ld">
                                ${
                                    colors.map(v=>{
                                        return `<div class "wi-color" style = "background-color:${v.color}; height:${v.height}"></div>`
                                    }).join('')
                                }
                            </div>
                        </div>
                    </div>`
        }).join('')
    }

    `
}


onNext(0)

