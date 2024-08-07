// import Lenis from '@studio-freight/lenis';


export default function () {

    if (!document.getElementById('events')) {
        console.log('No EVENTS Section - abort');
        return false;
    }

    console.log('event.js loaded');

    // Target our event elements
    const eventSection = document.getElementById('events');
    const eventElements = document.querySelectorAll('[data-elem-event]');
    // Set vars
    const restaurantId = document.querySelector('html').dataset.id;
    const currentDate = new Date();
    const devServer = 'http://localhost:4000';
    const prodServer = 'https://rc-server-prod.herokuapp.com';
    const api = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) ? prodServer : prodServer;
    let eventsLoaded = false;


    // Wait for page load & fetch events
    window.addEventListener('load', function () {
        console.log(`Fetch events`);
        fetchAllEvents();
    });

    function fetchAllEvents() {

        // Abort if already loaded
        if (eventsLoaded) { return false; }

        const body = JSON.stringify({
            api_key: 'e21421ieb2l1eb2134g21ieg21be2i1n42432',
            user_code: 'CF-418-Beta',
            restaurant_id: restaurantId,
            valid: false
        });

        // console.log(body);

        fetch(`${api}/public/restaurantoffers`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: body
        })
            // check for valid response
            .then(response => {
                // format
                return response.json();
            })
            .then(data => {
                // abort if array is empty
                if (data.count < 1) { return false; }
                // build events
                createEventSection(data['offers']);
            })
            .catch(err => console.log(err));
    }


    /**
     * Build the DOM elements
     * @param events - array of all events
     * @returns {boolean} guard clause
     */
    function createEventSection(events)  {

        // console.log(events);

        // we only want offers that are in date or marketing date range
        const activeEvents = getActiveEvents(events);

        // abort if no valid promotions are returned
        if (activeEvents.length < 1) {
            console.log(`${events.length} events but all inactive!`);
            return false;
        }

        // create DOM elements
        const eventFragment = document.createDocumentFragment();
        const eventSlider = document.createElement('div');
        eventSlider.className = 'event-scroller snaps-inline';

        // create event cards
        activeEvents.forEach((event, index) => {
            let eventCard = document.createElement('div');
            let eventElementString =
                `<div class="event-card" aria-label="Event" id="event-${index + 1}">` +
                `<img src="${event['offer_image']}" alt="Event image">` +
                `<div class="event-card-content">` +
                `<h2>${event['offer_tag']}</h2>` +
                `<span class="event-card-subtitle">${event['offer_strapline']}</span>` +
                `<p>${event['offer_text']}</p>`;

            // add optional link
            if (event['offer_link']) {
                eventElementString += `<a href="${event['offer_link']}" target="_blank">More Information</a>`;
            }

            // complete tags and append card to scroller
            eventElementString += `</div></div>`;
            eventCard.innerHTML = eventElementString;
            eventSlider.appendChild(eventCard);
        });

        // add to DOM
        eventFragment.append(eventSlider);
        eventSection.append(eventFragment);

        // remove hidden class from all relevant DOM elements
        eventElements.forEach(elem => elem.classList.remove('hidden'));

        // const eventScroller = document.querySelector('.event-scroller');
        //
        // const lenis = new Lenis({
        //     wrapper: eventScroller,
        //     infinite: true,
        //     orientation: 'horizontal'
        // });
        // lenis.on('scroll', (e) => {
        //     console.log(e)
        // });
        // function raf(time) {
        //     lenis.raf(time);
        //     requestAnimationFrame(raf);
        // }
        //
        // requestAnimationFrame(raf);
        //
        // console.log(eventScroller);

    }

    /**
     *
     * @param events array of events/promotions
     * @returns {*[]} an array of valid promotions - i.e. in date range
     */
    function getActiveEvents(events) {
        let activeEvents = [];
        events.forEach( event => {
            // abort if beyond end date
            if (currentDate > new Date(event['offer_to']) || currentDate > new Date(event['offer_marketed_to'])) { return; }
            // or before market from data
            if (currentDate < new Date(event['offer_marketed_from'])) { return; }
            activeEvents.push(event);
        });
        // console.log(`Events: ${activeEvents.length} / ${events.length} active`);
        return activeEvents;
    }
}

