import { AddButton } from '../AddButton/AddButton'
import { SearchButton } from '../SearchButton/SearchButton'
import { TicketCard } from '../TicketCard/TicketCard'

import styles from './SearchResults.module.sass'

export const SearchResults = ({ items, searched, searchHandler, addItemsHandler }) => {
    // console.log(items)
    return (
        <div className={styles.searchResult}>
            {!searched && <SearchButton getTickets={searchHandler} />}
            {items.length > 0 ?
                items.map((item, index) => (
                    <TicketCard key={index} ticket={item} />
                ))
                : false
            }
            {items.length > 0 && <AddButton addItemsHandler={addItemsHandler} />}
        </div>
    )
}
