import styles from './Styles/Input.module.css'
import { forwardRef } from 'react'
interface CInput {
    Label?: string,
    value,
    onChange,
    placeholder?: string,
    Icon?: string,
    type?: string,
    ref?: any
};
const Input: React.FC<CInput> = forwardRef<HTMLInputElement,CInput>(({ Label, value, onChange, placeholder, Icon, type = 'text' }, ref) => {
    return (
        <div className={styles.input_container}>
            {Label ? <label htmlFor={Label}>{Label}</label> : null}
            <div>
                <input ref={ref} placeholder={placeholder} id={Label} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
                {Icon ? <span className="material-icons-outlined">{Icon}</span> : null}
            </div>
        </div>
    )
})
export default Input;