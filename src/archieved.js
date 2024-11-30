// utils.js
function showDate() {
    var dateString = new Date().toISOString().substr(0, 10)
    document.getElementById("date").innerHTML = dateString
}

function toggleContent() {
    var contentDiv = document.querySelector(".content")
    if (contentDiv.style.display === "none") {
        contentDiv.style.display = "block"
    } else {
        contentDiv.style.display = "none"
    }
}

module.exports = { showDate, toggleContent }
