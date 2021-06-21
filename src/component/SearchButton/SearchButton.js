import styles from './SearchButton.module.sass'

export const SearchButton = ({ getTickets }) => {
    return (
        <button
            type='button'
            className={styles.searchButton}
            onClick={getTickets}
        >
            Найти билеты!
        </button>
    )
}
