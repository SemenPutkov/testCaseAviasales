import styles from './TicketCard.module.sass'

import { hoursCalcHandler, numberFormatHandler } from '../../handlers/numberHandler'

export const TicketCard = ({ ticket }) => {
    return (
        <div className={styles.ticketCard} >
            <div className={styles.ticketHeader}>
                <div className={styles.ticketPrice}>{numberFormatHandler(ticket.price)} Р</div>
                <div className={styles.ticketCarrier} title={ticket.carrier}><img src={`https://pics.avs.io/99/36/${ticket.carrier}.png`} alt={`Carrier code ${ticket.carrier}`} /></div>
            </div>
            {ticket.segments.map((item, index) => {
                const { startDate, endDate, durationHours, durationMins } = hoursCalcHandler(item.date, item.duration)

                return (
                    <div key={index} className={styles.flyInfoBox}>
                        <div className={styles.destInfoSubBox}>
                            <div className={styles.subBoxTitle}>
                                {item.origin}-{item.destination}
                            </div>
                            <div className={styles.subBoxInfo}>
                                {startDate} - {endDate}
                            </div>
                        </div>
                        <div className={styles.destInfoSubBox}>
                            <div className={styles.subBoxTitle}>в пути</div>
                            <div className={styles.subBoxInfo}>
                                {durationHours}ч {durationMins}м
                            </div>
                        </div>
                        <div className={styles.destInfoSubBox}>
                            {item.stops.length === 0 ?
                                <div className={styles.subBoxTitle}>
                                    Без пересадок
                                </div> :
                                item.stops.length > 1 ?
                                    <div className={styles.subBoxTitle}>
                                        {item.stops.length} пересадки
                                    </div> :
                                    <div className={styles.subBoxTitle}>
                                        {item.stops.length} пересадка
                                    </div>
                            }
                            <div className={styles.subBoxInfo}>
                                {item.stops.join(', ')}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
