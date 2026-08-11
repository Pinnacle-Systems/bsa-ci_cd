import moment from 'moment';
export const calculateTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return '0h 0m';
  }

  // Support parsing both 12-hour format with AM/PM and 24-hour format
  const formats = [
    'hh:mm:ss A',
    'hh:mm A',
    'h:mm:ss A',
    'h:mm A',
    'HH:mm:ss',
    'HH:mm',
  ];
  const start = moment(startTime, formats);
  const end = moment(endTime, formats);

  if (!start.isValid() || !end.isValid()) {
    return '0h 0m';
  }

  // If end time is before start time, assume it spans across midnight into the next day
  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

  const duration = moment.duration(end.diff(start));

  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  return `${hours}h ${minutes}m`;
};
