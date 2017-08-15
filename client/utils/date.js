const format = require('date-fns/format')

exports.formatDate = date => format(date, 'MMMM D')
