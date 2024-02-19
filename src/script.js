import "../libraries/pizzip.js"
import "../libraries/filesaver.js"
import "../libraries/pizzip-utils.js"
// Access Docxtemplater through the global window object

const doc = new window.docxtemplater();

document.addEventListener('DOMContentLoaded', () => {


    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() +  1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear().toString().slice(-2); // Get last two digits of the year
    const formattedDate = `${day}/${month}/${year}`;





    const dataDiConvocazioneElement = document.getElementById('dataDiConvocazione');
    const dataDiConvocazione = dataDiConvocazioneElement.value;

    // Converti la stringa in un oggetto Date


    const submitButton = document.querySelector('.dark-theme-form button[type="submit"]');
    submitButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        try {


            const date = new Date(dataDiConvocazione);

            // Formatta la data nel formato dd/mm/yy
            const day1 = String(date.getDate()).padStart(2, '0');
            const month1 = String(date.getMonth() +  1).padStart(2, '0'); // I mesi sono zero-based, quindi aggiungi  1
            const year1 = date.getFullYear().toString().slice(-2); // Ottieni gli ultimi due caratteri dell'anno
            const formattedDate1 = `${day1}/${month1}/${year1}`;
        
            console.log(formattedDate1); // Esempio di output: "15/04/23"

            const response = await fetch('./assets/rai.docx');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();

            // Convert the blob to an ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer();

            // Load the ArrayBuffer into a PizZip instance
            const zip = new PizZip(arrayBuffer);

            // Create a Docxtemplater instance and load the zip


            doc.loadZip(zip);

            // Set the data for the template
            doc.setData({
                rappresentante1: 'David Novelli',
                rappresentante2: 'Tommaso Coviello',
                rappresentante3: 'Ferri Ludovica',
                rappresentante4: 'Rosario Esmeralda Yoshimi',
                ComputerConnessoAinternet: 'Computer connesso a internet',
                proiettore: 'proiettore',
                datadiconvocazione: formattedDate1,
                ordinedelgiorno1: document.getElementById('ordineDelGiorno1').value,
                ordinedelgiorno2: document.getElementById('ordineDelGiorno2').value,
                datadioggi: formattedDate
                // ... any other data you want to set ...
            });

            // Render the document
            try {
                doc.render();
            } catch (error) {
                console.error(error);
                return;
            }

            // Generate the output
            const output = doc.getZip().generate({ type: 'blob' });
            // Create a URL for the blob and trigger the download
            const downloadUrl = URL.createObjectURL(output);
            
            const tempAnchor = document.createElement('a');
            tempAnchor.href = downloadUrl;
            tempAnchor.download = 'modified.docx';
            tempAnchor.style.display = 'none'; // Hide the anchor element
            document.body.appendChild(tempAnchor); // Append the anchor to the body
            tempAnchor.click(); // Simulate a click on the anchor
            document.body.removeChild(tempAnchor); // Remove the anchor from the body

            location.reload()

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
});








