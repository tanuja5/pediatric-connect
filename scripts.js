document.addEventListener('DOMContentLoaded', function() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonthYear = document.getElementById('calendarMonthYear');
    const selectedDateTime = document.getElementById('selectedDateTime');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const meetingForm = document.getElementById('meetingForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;

    renderCalendar(currentMonth, currentYear);

    document.querySelector('.btn-prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.querySelector('.btn-next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    function renderCalendar(month, year) {
        calendarDays.innerHTML = '';
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarMonthYear.textContent = `${getMonthName(month)} ${year}`;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('day');
            if (date < currentDate) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', function() {
                    selectedDate = date;
                    document.querySelectorAll('.day').forEach(day => day.classList.remove('active'));
                    this.classList.add('active');
                    generateTimeSlots();
                });
            }
            calendarDays.appendChild(dayElement);
        }
    }

    function getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    function generateTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        for (let hour = 0; hour < 24; hour++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = `${String(hour).padStart(2, '0')}:00 - ${String(hour).padStart(2, '0')}:59`;
            slot.addEventListener('click', function() {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                selectedDateTime.value = `${formattedDate} ${String(hour).padStart(2, '0')}:00`;
                document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('active'));
                this.classList.add('active');
            });
            timeSlotsContainer.appendChild(slot);
        }
    }

    meetingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const meetingType = formData.get('meetingType');
        const name = formData.get('name');
        const email = formData.get('email');
        const selectedDateTimeValue = formData.get('selectedDateTime');

        confirmationMessage.innerHTML = `
            <p>Thank you, ${name}!</p>
            <p>Your ${meetingType} on ${selectedDateTimeValue} has been scheduled.</p>
        `;

        this.reset();
        document.querySelectorAll('.day').forEach(day => day.classList.remove('active'));
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('active'));
        selectedDateTime.value = '';
    });
});
