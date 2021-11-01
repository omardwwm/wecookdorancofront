export function formatDate(dateFromDB) {
    let date = new Date(dateFromDB)
    // console.log(date);
    const currentMonth = date.getMonth()+1; // because getmonth() in JS start from 0
    const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
    const currentDate = date.getDate();
    const currentDateHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentDateTimes =(dateTime)=>(
        dateTime >= 10 ? dateTime : `0${dateTime}`
    )    
    // const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
    return `${date.getFullYear()}-${monthString}-${currentDateTimes(currentDate)} at ${currentDateTimes(currentDateHours)}:${currentDateTimes(currentMinutes)}`;
}