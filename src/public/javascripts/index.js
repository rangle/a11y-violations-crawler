(function () {

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    const buttonClick = (e) => {
        e.preventDefault();
        console.log('submit clicked');
        console.log(e);
        const siteUrl = document.getElementById('site-url').value;

        if (siteUrl === '') {
            return;
        }
        document.getElementById('progress-message').classList.add('show');
        document.getElementById('site-url').value = '';

        postData('/launch', { siteUrl: siteUrl })
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
                if (data && data.result === 'success') {
                    document.getElementById('success-message').classList.add('show');
                }
            });


    };

    console.log('adding evt listener');
    document.getElementById('scan-launch-btn').addEventListener('click', buttonClick);


})();
