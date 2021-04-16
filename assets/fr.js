import { prominent } from 'color.js'

function SetGradientBackground(img, span,span2,Title) {
    if (img) {
        prominent(img, { amount: 4, format: 'hex' }).then((data) => {
            span.style.background = `linear-gradient(90deg, ${data[1]} 0%,${data[2]} 50%,${data[3]} 100%)`;
            span2.style.background = `linear-gradient(90deg, ${data[1]} 0%,${data[2]} 50%,${data[3]} 100%)`
        })
    }
}

function ChangeBackgroundOnHover(element, color) {
    if (element) {
        element.addEventListener('mouseover', () => {
            element.style.background = color
        })
        element.addEventListener('mouseleave', () => {
            element.style.background = ''
        })
    }
}
function Counter(element) {
    console.log(element);
    element.innerHTML = 100 
}
var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

var getColor = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var rangePct = (pct - lower.pct) / 0.5;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
};
const div = document.querySelector(".statbar")
function Counters(Value) {
    for (let i = 0; i < Value ; i++) {
        console.log(i);
    }
    return Value
}
if(div){
    setInterval(Counters(div.innerHTML),50)
}


export {SetGradientBackground,ChangeBackgroundOnHover,getColor,Counter};


