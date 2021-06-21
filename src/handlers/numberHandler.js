import BigNumber from 'bignumber.js'
import moment from 'moment'

export function numberFormatHandler(numb) {
    const fmt = {
        prefix: '',
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
        suffix: ''
    }
    BigNumber.config({ FORMAT: fmt })

    const formatNumb = new BigNumber(numb)
    return formatNumb.toFormat(0)
}

export function hoursCalcHandler(start, end) {
    const d = Date.parse(start) + end * 60000
    const rowS = moment(start)
    const rowE = moment(d)

    const startDate = moment(start).format('h:mm')
    const endDate = moment(d).format('h:mm')
    const durationHours = moment.duration(rowE.diff(rowS)).get('hours')
    const durationMins = moment.duration(rowE.diff(rowS)).get('minutes')

    return { startDate, endDate, durationHours, durationMins }
}