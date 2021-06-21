import { FilterItem } from '../FilterItem/FilterItem'
import styles from './Filter.module.sass'

export const Filter = ({ querys, filterHandler }) => {
    return (
        <div className={styles.filter}>
            <div className={styles.filterHeader}>Количество пересадок</div>
            {querys.map((query, index) => (
                <FilterItem key={index}
                    text={query.text}
                    checked={query.checked}
                    clickHandler={() => filterHandler(index)}
                />
            ))}

        </div>
    )
}
