//레벨설정
//maxCount :  병 갯수
//colorCount: 물색 종류
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
    dcMain.innerHTML = `<div class="bar" style="display:none"></div>
        ${
            Array.from(new Array(rule.maxCount)).map((v, i) => {
                const haveColorIndex = rule.maxCount - rule.emptyCount
                const arr = colorList.slice(0, rule.colorCount).sort(v => Math.random() - 0.5)
                let colors = []
                if (i < haveColorIndex) {
                    colors = arr.map(v => ({height: 100 / rule.colorCount + '%', color: v}))
                }

                return `<div class="water-ls">
                    <div class="water-item" onclick="onClick(${i})" id="m${i}">
                        <div class="water-ld">
                            ${
                                colors.map(v => {
                                    return `<div class="wi-color" 
                                        style="background-color:${v.color};height:${v.height}"></div>`
                                }).join('')
                            }
                        </div>
                    </div>
                </div>`
            }).join('')
        }
    `
}

//마우스 클릭 이벤트

const onClick = (index) => {

    //잘못된 이벤트 팝업
    const activeIndex = [...document.querySelectorAll('.water-item')].findIndex(v => v.className.indexOf('active') >= 0);
    const currColorsItem = document.querySelector(`#m${index} .water-ld`);
    const activeColorsItem = document.querySelector(`#m${activeIndex} .water-ld`);

    if (activeColorsItem && index != activeIndex) {
        const activeColorLength = activeColorsItem.children.length;
        const currColorLength = currColorsItem.children.length;
        if (activeColorLength === 0) {
            dcMain.querySelector(`#m${activeIndex}`).classList.remove('active');
            return alert('빈병은 물을 부을수 없습니다.')
        }
        if (currColorLength && activeColorLength) {
            if (activeColorsItem.children[activeColorLength - 1].style.backgroundColor  !== 
                currColorsItem.children[currColorLength-1].style.backgroundColor) {
                return alert('같은 색의 물만 부을수 있습니다.');
            }
            if(currColorsItem.children.length >= allData[allDataIndex].colorCount){
                return alert ('이 물병은 물이 더 이상 들어갈수 없습니다.')
            }
        }
    }

    const activeEl = dcMain.querySelector(`#m${activeIndex}`);
    const currEl = dcMain.querySelector(`#m${index}`);
     
    //물병 위아래 컨트롤
    if(activeIndex === index){
        activeEl.classList.remove('active')
    }
    else if(activeIndex === -1){
        currEl.classList.add('active');
    }
    else{
        
        //물병 들어서 이동 (물병에 있는 물도 같이 이동)
        let r1 = currEl.getBoundingClientRect();
        let r2 = activeEl.getBoundingClientRect();
        let x = 0;
        let y = 0;
        let rotate = '';
        if (r1.left < r2.left) {
            rotate = '-90';
            x = r1.height - (r1.top - r2.top - 30) + 'px';
            y = (r1.left - r2.left + r1.height / 2 - 2) + 'px';
        }
        else{
            rotate = '90';
            x = -(r1.height - (r1.top - r2.top - 30)) + 'px';
            y = (r2.left - r1.left + r1.height / 2 - 2) + 'px';
        }

        activeEl.setAttribute('style', `transform: rotate(${rotate}deg) translate(${x}, ${y});`);
        activeEl.querySelector('.water-ld').setAttribute('style', `transform : rotate(${-rotate}deg) scale(5, 0.25)`);
        
        const activeColors = [...activeColorsItem.children].map(v => v.style.backgroundColor);
        
        //같은 색 이 겹칠 경우 count, 
        const forCount = activeColors.reverse().reduce((sum,v,i,arr) => {
            if (arr[i-1] && v === arr[i-1]) {
                return sum+1;
            }
            return sum;
        },1)

        //물병에 물을 부을때 물이 없어지는 이벤트
        const colorElAll = activeEl.querySelectorAll('.wi-color');
        for(let i=0; i<forCount; i++){
            const colorIndex = activeColors.length - (i+1);
            const colorEl = colorElAll[colorIndex];
            colorEl.style.height = 0
            currEl.querySelector('.water-ld').appendChild(colorEl.cloneNode());
            colorEl.ontransitionend = () => {
                colorEl.parentNode.removeChild(colorEl);
            }
    }
        //물 받은 물병에 물 생성하기 
        const barEl = dcMain.querySelector('.bar');
        const currColors = [...currColorsItem.children].map(v=>v.style.backgroundColor)
        setTimeout(()=>{
            let top = r1.top - 37;
            let left = r1.left + r1.width / 2
            const currColorElAll = currEl.querySelectorAll('.wi-color');

            //물 위치 올라가기 및 속도 조절
            for(let i =0; i < forCount; i++){
                const colorIndex = currColors.length - (i+1);
                currColorElAll[colorIndex].style.height = 100 / allData[allDataIndex].colorCount + '%';
            }
            barEl.setAttribute('style', `display:block;left:${left}px;top:${top}px;background-color:${currColors[currColors.length - 1]}`)
        },400);
        
        //물 부은 다음 원래 위치로 돌려놓기
        setTimeout(()=>{
            activeEl.setAttribute('style', ``)
            activeEl.classList.remove('active')
            activeEl.querySelector('.water-ld').removeAttribute('style')
            
            barEl.style.display = 'none'

        //통관여부 체크
        
        let isOK = [...dcMain.querySelectorAll('.water-ld')].every(v=>{
        const colors = [...v.children].map(v=> v.style.backgroundColor);
        if (v.children[0] && 100 / parseFloat(v.children[0].style.height) !== v.children.length) {
            return false
        }
        return colors.every((k,i) => {
                return !colors[i-1] || k === colors[i-1];
            });
        });
            
        if (isOK) {
            onNext(allDataIndex+1);
            }
        },1500);
        

    }
}



onNext(0)
