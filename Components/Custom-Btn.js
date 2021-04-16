import { useEffect } from 'react';
import test from '../assets/Button.module.css'

function Do(e) {
}
function CustomButton({ Title = "Button", Neon = false, WithBorder = false, MainColor = "White", SecondColor = MainColor, isLink = false, Click = Do }) {
    var ClassList =test.CButton;
    if (Neon) {
        ClassList = ClassList+' '+test.Neon
    }
    if (WithBorder) {
        ClassList = ClassList+' '+test.Border
    }
    useEffect(()=>{
        const root = document.querySelector(':root')
        root.style.setProperty('--MainColor', MainColor)
        root.style.setProperty('--SecondColor', SecondColor)
    },[MainColor, SecondColor])
    
    if (!isLink) {
        return (
            <button className={ClassList} onClick={(e) => {
                Click(e)
            }}>
                {Title}
            </button>
        )
    }
    else {
        return (
            <a href="/" className={ClassList} >
                {Title}
            </a>
        )
    }

}
export default CustomButton