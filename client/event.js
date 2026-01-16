document.addEventListener("DOMContentLoaded", function() {
    const monthYearElement = document.querySelector(".cal-nav span");
    const calendarGrid = document.querySelector(".cal-grid");

    // Use the actual current date for the calendar.
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Calculate previous month and its year
    let prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    let prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const eventsByMonth = {
        // Key is "YYYY-M"
        [`${currentYear}-${currentMonth}`]: [
            {
                day: today.getDate() > 15 ? 25 : 15,
                month: monthAbbr[currentMonth],
                title: `${currentYear} National Tax and Audit Summit`,
                desc: "Join industry leaders for 2 days intensive session",
                fullDate: `${monthAbbr[currentMonth]} 25 - 26`,
                location: "Lagos Island",
                cost: "Paid",
                host: "Led by Mr Kehinde - President, ICAN"
            },
            {
                day: today.getDate() > 20 ? 28 : 22,
                month: monthAbbr[currentMonth],
                title: "Tech Networking Meetup",
                desc: "Networking and knowledge sharing for professionals.",
                fullDate: `${monthAbbr[currentMonth]} 26`,
                location: "Virtual",
                cost: "Free",
                host: "Led by Accountable Futures Community"
            }
        ],
        [`${prevMonthYear}-${prevMonth}`]: [
            {
                day: 15,
                month: monthAbbr[prevMonth],
                title: "Previous Month Industry Conference",
                desc: "Reviewing key developments in the field",
                fullDate: `${monthAbbr[prevMonth]} 15 - 16`,
                location: "Virtual",
                cost: "Free",
                host: "Led by Industry Experts"
            },
            {
                day: 22,
                month: monthAbbr[prevMonth],
                title: "Professional Skills Workshop",
                desc: "Practical session on essential career skills.",
                fullDate: `${monthAbbr[prevMonth]} 22`,
                location: "Online",
                cost: "Paid",
                host: "Led by Mentors Team"
            }
        ]
    };

    function renderCalendar(month, year) {
        // Clear existing calendar days, but keep the day headers
        const dayHeaders = Array.from(calendarGrid.querySelectorAll('.day-head'));
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header));

        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthKey = `${year}-${month}`;
        const meetingDays = (eventsByMonth[monthKey] || []).map(event => event.day);

        // Add blank divs for the days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const blankDay = document.createElement("div");
            calendarGrid.appendChild(blankDay);
        }

        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;

            // Highlight the current day
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add("current-day");
            }

            // Add a white circle for meeting dates
            if (meetingDays.includes(day)) {
                dayElement.classList.add("active-day");
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    function renderEvents(events) {
        eventsContainer.innerHTML = ''; // Clear existing events
        if (!events || events.length === 0) {
            eventsContainer.innerHTML = '<p>No events to display for this period.</p>';
            return;
        }

        events.forEach(event => {
            const eventCard = `
                <div class="event-list-card">
                    <div class="date-badge">
                        <span class="month">${event.month}</span>
                        <span class="day">${event.day}</span>
                    </div>
                    <div class="list-details">
                        <h3>${event.title}</h3>
                        <p>${event.desc}</p>
                        <div class="meta-grid">
                          <span><i data-lucide="calendar"></i> ${event.fullDate}</span>
                          <span><i data-lucide="map-pin"></i> ${event.location}</span>
                          <span><i data-lucide="circle-dollar-sign"></i> ${event.cost}</span>
                         </div>
                        <div class="list-host">${event.host}</div>
                    </div>
                    <button class="btn-reserve-outline">Reserve Your Seat</button>
                </div>
            `;
            eventsContainer.innerHTML += eventCard;
        });
        lucide.createIcons(); // Re-initialize icons after adding them to the DOM
    }

    const upcomingBtn = document.getElementById("upcoming-btn");
    const pastBtn = document.getElementById("past-btn");
    const eventsContainer = document.getElementById("events-container");

    function initialize() {
        // Set initial state to "Upcoming"
        renderCalendar(currentMonth, currentYear);
        const upcomingEvents = eventsByMonth[`${currentYear}-${currentMonth}`] || [];
        renderEvents(upcomingEvents);
        upcomingBtn.classList.add("active");
        pastBtn.classList.remove("active");
    }

    upcomingBtn.addEventListener("click", () => {
        if (!upcomingBtn.classList.contains("active")) {
            upcomingBtn.classList.add("active");
            pastBtn.classList.remove("active");

            const upcomingEvents = eventsByMonth[`${currentYear}-${currentMonth}`] || [];
            renderEvents(upcomingEvents);
            renderCalendar(currentMonth, currentYear);
        }
    });

    pastBtn.addEventListener("click", () => {
        if (!pastBtn.classList.contains("active")) {
            pastBtn.classList.add("active");
            upcomingBtn.classList.remove("active");

            const pastEvents = eventsByMonth[`${prevMonthYear}-${prevMonth}`] || [];
            renderEvents(pastEvents);
            renderCalendar(prevMonth, prevMonthYear);
        }
    });

    initialize(); // Set the initial view when the page loads
});
