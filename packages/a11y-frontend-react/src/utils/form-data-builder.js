export default function buildFormData(resultFileInputName, resultsFile, filePrefixInputName, filePrefix, fileContents) {

    // We need a separator to define each part of the request
    const boundary = "blob";

    // Store our body request in a string.
    let data = "";

    console.log('resultsFile? ', resultsFile);

    // So, if the user has selected a file
    if (resultsFile) {
        // Start a new part in our body's request
        data += "--" + boundary + "\r\n";

        // Describe it as form data
        data += 'content-disposition: form-data; '
            // Define the name of the form data
            + `name="${resultFileInputName}";`
            // Provide the real name of the file
            + `filename="${resultsFile.name}"\r\n`;
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
    data += 'content-disposition: form-data; name="' + filePrefixInputName + '"\r\n';
    // There's a blank line between the metadata and the data
    data += '\r\n';

    // Append the text data to our body's request
    data += filePrefix + "\r\n";

    // Once we are done, "close" the body's request
    data += "--" + boundary + "--";

    return data;

}