// =============================
// Employee Management Dashboard
// Developed by Saumya Singh
// =============================

const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const searchInput = document.getElementById("search");
const departmentFilter = document.getElementById("filterDepartment");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

let employees = JSON.parse(localStorage.getItem("employees")) || [];

function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function showToast(message) {

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}

function updateDashboard() {

    document.getElementById("totalEmployees").innerHTML = employees.length;

    document.getElementById("activeEmployees").innerHTML =
        employees.filter(emp => emp.status === "Active").length;

    const departments =
        [...new Set(employees.map(emp => emp.department))];

    document.getElementById("departmentCount").innerHTML =
        departments.length;

}

function displayEmployees(data = employees) {

    employeeTable.innerHTML = "";

    data.forEach((employee,index)=>{

        employeeTable.innerHTML += `

        <tr>

            <td>${employee.name}</td>

            <td>${employee.email}</td>

            <td>${employee.department}</td>

            <td>

                <span class="status">

                    ${employee.status}

                </span>

            </td>

            <td>

                <button
                    class="editBtn"
                    onclick="editEmployee(${index})">

                    Edit

                </button>

                <button
                    class="deleteBtn"
                    onclick="deleteEmployee(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    updateDashboard();
    
}

// =============================
// ADD / UPDATE EMPLOYEE
// =============================

employeeForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const id = document.getElementById("employeeId").value;

    const employee = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        department: document.getElementById("department").value,

        status: "Active"

    };

    if (
        employee.name === "" ||
        employee.email === "" ||
        employee.department === ""
    ) {

        showToast("⚠ Please fill all fields");

        return;

    }

    if (id === "") {

        employees.push(employee);

        showToast("✅ Employee Added Successfully");

    } else {

        employees[id] = employee;

        showToast("✏ Employee Updated Successfully");

        submitBtn.innerHTML = "Add Employee";

        document.getElementById("employeeId").value = "";

    }

    saveEmployees();

    displayEmployees();

    employeeForm.reset();

});

// =============================
// DELETE EMPLOYEE
// =============================

function deleteEmployee(index) {

    const confirmDelete = confirm("Delete this employee?");

    if (!confirmDelete) return;

    employees.splice(index, 1);

    saveEmployees();

    displayEmployees();

    showToast("🗑 Employee Deleted");

}

// =============================
// EDIT EMPLOYEE
// =============================

function editEmployee(index) {

    const employee = employees[index];

    document.getElementById("employeeId").value = index;

    document.getElementById("name").value = employee.name;

    document.getElementById("email").value = employee.email;

    document.getElementById("department").value = employee.department;

    submitBtn.innerHTML = "Update Employee";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// =============================
// SEARCH
// =============================

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const filtered = employees.filter(employee =>

        employee.name.toLowerCase().includes(value) ||

        employee.email.toLowerCase().includes(value) ||

        employee.department.toLowerCase().includes(value)

    );

    displayEmployees(filtered);

});

// =============================
// FILTER
// =============================

departmentFilter.addEventListener("change", function () {

    const value = this.value;

    if (value === "") {

        displayEmployees();

        return;

    }

    const filtered = employees.filter(emp =>

        emp.department === value

    );

    displayEmployees(filtered);

});

// =============================
// EXPORT CSV
// =============================

document.getElementById("exportCSV").addEventListener("click", () => {

    if (employees.length === 0) {

        showToast("⚠ No Employee Data");

        return;

    }

    let csv = "Name,Email,Department,Status\n";

    employees.forEach(emp => {

        csv += `${emp.name},${emp.email},${emp.department},${emp.status}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "employees.csv";

    a.click();

    URL.revokeObjectURL(url);

    showToast("📁 CSV Exported Successfully");

});

// =============================
// DARK MODE
// =============================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerHTML = "☀ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.innerHTML = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

});

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML = "☀ Light Mode";

}


// =============================
// KEYBOARD SHORTCUT
// Ctrl + F focuses Search Box
// =============================

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key.toLowerCase() === "f") {

        e.preventDefault();

        searchInput.focus();

    }

});

let chart;

function updateChart(){

    const departments = {};

    employees.forEach(employee=>{

        if(departments[employee.department]){

            departments[employee.department]++;

        }else{

            departments[employee.department]=1;

        }

    });

    const labels=Object.keys(departments);

    const values=Object.values(departments);

    if(chart){

        chart.destroy();

    }

    const ctx=document.getElementById("departmentChart");

    chart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:labels,

           datasets: [{

    data: values,

    backgroundColor: [

        "#2563eb",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6"

    ],

    hoverOffset: 30,

    borderRadius: 10,

    spacing: 4,

    borderColor: "#ffffff",

    borderWidth: 2

}]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

displayEmployees();
updateChart();