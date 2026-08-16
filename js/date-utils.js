function DateUtils()
{
    this.formattedDateTime = formattedDateTime;

    return this;

    function formattedDateTime() {
        const currentdate = new Date();
        return addZero(currentdate.getDate()) + "/"
            + addZero(currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + " @ "
            + addZero(currentdate.getHours()) + ":"
            + addZero(currentdate.getMinutes()) + ":"
            + addZero(currentdate.getSeconds());
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
