(function () {

    // Example POST method implementation:
    async function postData(url = '', data, contentType = 'application/json') {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': contentType
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: data // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    const crawlButtonClick = (e) => {
        e.preventDefault();
        // console.log('crawl submit clicked');

        let autoScan = false;
        const siteUrl = document.getElementById('site-url').value;
        autoScan = document.getElementById('auto-scan').checked;

        if (siteUrl === '') {
            return;
        }
        document.getElementById('progress-message').classList.add('show');
        document.getElementById('site-url').value = '';

        postData('/launch-crawler', JSON.stringify({ siteUrl: siteUrl, autoScan: autoScan }))
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
                if (data && data.result === 'success') {
                    document.getElementById('success-message').classList.add('show');
                }
            });


    };

    const scanButtonClick = (e) => {
        e.preventDefault();


        const resultsFile = document.getElementById('results-file').files[0];
        const filePrefix = document.getElementById('filePrefix');
        let fileContents = '';

        // Use the FileReader API to access file content
        const reader = new FileReader();


        // At page load, if a file is already selected, read it.
        if (resultsFile) {
            reader.readAsBinaryString(resultsFile);
        }

        // sendData is our main function
        function buildData(fileContents) {

            // We need a separator to define each part of the request
            const boundary = "blob";

            // Store our body request in a string.
            let data = "";

            // So, if the user has selected a file
            if (resultsFile) {
                // Start a new part in our body's request
                data += "--" + boundary + "\r\n";

                // Describe it as form data
                data += 'content-disposition: form-data; '
                    // Define the name of the form data
                    + 'name="' + 'results-file' + '"; '
                    // Provide the real name of the file
                    + 'filename="' + resultsFile.name + '"\r\n';
                // And the MIME type of the file
                data += 'Content-Type: ' + resultsFile.type + '\r\n';

                // There's a blank line between the metadata and the data
                data += '\r\n';

                // Append the binary data to our body's request
                data += fileContents + '\r\n';
            }

            // Start a new part in our body's request
            data += "--" + boundary + "\r\n";

            // Say it's form data, and name it
            data += 'content-disposition: form-data; name="' + filePrefix.name + '"\r\n';
            // There's a blank line between the metadata and the data
            data += '\r\n';

            // Append the text data to our body's request
            data += filePrefix.value + "\r\n";

            // Once we are done, "close" the body's request
            data += "--" + boundary + "--";

            return data;

        }


        reader.addEventListener("load", function () {
            fileContents = reader.result;

            postData('/launch-scanner', buildData(fileContents), 'multipart/form-data; boundary=blob')
                .then(data => {
                    console.log(data); // JSON data parsed by `data.json()` call
                    if (data && data.result === 'success') {
                        document.getElementById('scan-success-message').classList.add('show');
                    }
                });

            document.getElementById('filePrefix').value = '';
            document.getElementById('scan-progress-message').classList.add('show');
        });



    };

    document.getElementById('crawl-launch-btn').addEventListener('click', crawlButtonClick);
    document.getElementById('scan-launch-btn').addEventListener('click', scanButtonClick);

})();
