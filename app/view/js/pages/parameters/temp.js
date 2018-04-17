// has reminder
$('#chooseDir').on('change', (event) => {
    console.log('->' + document.getElementById("chooseDir").files[0].path);
});

// HTML
// <input type="file" id="chooseDir" webkitdirectory >