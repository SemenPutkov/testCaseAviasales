import styles from './AddButton.module.sass'

export const AddButton = ({ addItemsHandler }) => {
    return (
        <button
            type='button'
            className={styles.addButton}
            onClick={addItemsHandler}
        >
            Показать еще 5 билетов!
        </button>
    )
}
