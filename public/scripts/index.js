// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime) {
    return new Date(epochTime * 1000);
}

// convert time to human-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime) {
    var epochDate = new Date(epochToJsDate(epochTime));
    var dateTime = epochDate.getFullYear() + "/" +
        ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
        ("00" + epochDate.getDate()).slice(-2) + " " +
        ("00" + epochDate.getHours()).slice(-2) + ":" +
        ("00" + epochDate.getMinutes()).slice(-2) + ":" +
        ("00" + epochDate.getSeconds()).slice(-2);

    return dateTime;
}

var database = firebase.database();


const loginElement = document.querySelector('#login-form');
const authBarElement = document.querySelector('#authentication-bar');
const userDetailsElement = document.querySelector('#user-details');
const tableContainerElement = document.querySelector('#table-container');
const viewDataButtonElement = document.getElementById('view-data-button');
const viewStaffButton = document.querySelector('#view-staff');
const deleteDataButton = document.querySelector('#delete-data');
const staffDatatElement = document.querySelector('#table-staff-data');

const staffForm = document.querySelector('#staffdata');




// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
    if (user) {
        loginElement.style.display = 'none';
        authBarElement.style.display = 'block';
        userDetailsElement.style.display = 'block';
        userDetailsElement.innerHTML = user.email;
        viewDataButtonElement.style.display = 'block';
        viewStaffButton.style.display = 'block';
        staffForm.style.display = 'block';
        // IF USER IS LOGGED OUT

        var uid = user.uid;// get user UID to get data from database
        console.clear();
        console.log(uid);

        // Database paths (with user UID)
        var dbPath = '/UsersData/GMZDAKZkQwVjiQC1aclg2uGCluI3/readings';
        var chartPath = 'UsersData/' + uid.toString() + '/charts/range';

        // Database references
        var dbRef = firebase.database().ref(dbPath);
        var chartRef = firebase.database().ref(chartPath);

        // [START rtdb_social_listen_star_count]
        var starCountRef = firebase.database().ref(dbPath);
        starCountRef.on('value', (snapshot) => {
            const data = snapshot.val();
        });
        console.log(starCountRef);
        // [END rtdb_social_listen_star_count]

        // TABLE
        var lastReadingTimestamp; //saves last timestamp displayed on the table
        // Function that creates the table with the first 100 readings
        function createTable() {
            // append all data to the table
            var firstRun = true;
            dbRef.orderByKey().limitToLast(100).on('child_added', function (snapshot) {
                if (snapshot.exists()) {
                    var jsonData = snapshot.toJSON();
                    console.log(jsonData);
                    var timestamp = jsonData.timestamp;
                    var name = jsonData.name;
                    var datein = jsonData.datein;
                    var timein = jsonData.timein;
                    var status = jsonData.status;
                    var content = '';
                    content += '<tr>';
                    content += '<td>' + name + '</td>';
                    content += '<td>' + datein + '</td>';
                    content += '<td>' + timein + '</td>';
                    content += '</tr>';
                    $('#tbody').prepend(content);
                    // Save lastReadingTimestamp --> corresponds to the first timestamp on the returned snapshot data
                    if (firstRun) {
                        lastReadingTimestamp = timestamp;
                        firstRun = false;
                        console.log(lastReadingTimestamp);
                    }
                }
            });
        };


        function createDataStaff(nameUID, month) {
            // append all data to the table
            var firstRun = true;
            var count = 0;
            dbRef.orderByKey().limitToLast(100).on('child_added', function (snapshot) {
                if (snapshot.exists()) {
                    var jsonData = snapshot.toJSON();
                    console.log(jsonData);
                    var timestamp = jsonData.timestamp;
                    var monthUID = jsonData.month;
                    var name = jsonData.name;
                    var statusStaff = jsonData.status;
                    if ((nameUID == name) && (month == monthUID)) {
                        if (statusStaff == "WORK") {
                            count = count + 1;
                        }
                        else {
                            count = count + 3;
                        }
                        var datein = jsonData.datein;
                        var timein = jsonData.timein;
                        var status = jsonData.status;
                        var content = '';
                        content += '<tr>';
                        content += '<td>' + name + '</td>';
                        content += '<td>' + datein + '</td>';
                        content += '<td>' + timein + '</td>';
                        content += '<td>' + status + '</td>';
                        content += '</tr>';
                        $('#datastaff').prepend(content);
                        // Save lastReadingTimestamp --> corresponds to the first timestamp on the returned snapshot data
                        if (firstRun) {
                            lastReadingTimestamp = timestamp;
                            firstRun = false;
                            console.log(lastReadingTimestamp);
                        }
                    }
                }
            });
            $('#countwork').prepend(count);
        };








        viewDataButtonElement.addEventListener('click', (e) => {
            // Toggle DOM elements
            //$('#tbody').remove();
            //$('#tbody').detach();
            tableContainerElement.style.display = 'block';
            viewDataButtonElement.style.display = 'none';
            viewStaffButton.style.display = 'none';
            staffForm.style.display = 'none';
            createTable();
        });

        staffForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Toggle DOM elements
            const namestaffUID = staffForm['input-namestaff'].value;
            const month = staffForm['input-month'].value;
            staffDatatElement.style.display = 'block';
            tableContainerElement.style.display = 'none';
            viewDataButtonElement.style.display = 'none';
            viewStaffButton.style.display = 'none';
            $('#namestaff').prepend(namestaffUID);
            createDataStaff(namestaffUID, month);
        });


    } else {
        loginElement.style.display = 'block';
        authBarElement.style.display = 'none';
        userDetailsElement.style.display = 'none';
        viewDataButtonElement.style.display = 'none';
        tableContainerElement.style.display = 'none';
        viewStaffButton.style.display = 'none';
        staffDatatElement.style.display = 'none';
        staffForm.style.display = 'none';
    }
}