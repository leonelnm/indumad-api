import dayjs from 'dayjs'

export const getBeginEndDateFromMonth = ({ year, month = undefined }) => {
  const begin = dayjs(new Date(`${year}-${month || '01'}-01`))
  const end = dayjs(new Date(`${year}-${month || 12}-${begin.daysInMonth()}`))

  return { begin: begin.toDate(), end: end.toDate() }
}

export const getDate = (date = new Date()) => {
  return date.toLocaleDateString('es-ES', { timeZone: getCurrentTimeZone() })
}

const getCurrentTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

export const getMonthAndYearToBilling = () => {
  const now = dayjs(new Date()).subtract(1, 'day')

  return {
    year: now.get('year'),
    month: now.get('month') + 1
  }
}
