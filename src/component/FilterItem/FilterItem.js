import styles from './FilterItem.module.sass'

export const FilterItem = ({ text, checked, clickHandler }) => {

    return (
        <div className={styles.filterItem} onClick={() => clickHandler()}>
            <input
                className={styles.filterCheckbox}
                type='checkbox'
                checked={checked}
                onChange={() => null}
            />
            <span className={styles.inputDesc}>{text}</span>
        </div>
    )
}
